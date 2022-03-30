<template>
  <section id="panel-upload">
    <MetaName :name="name" :valid="nameValid" @on-changed="onNameChanged" />
    <MetaDescription
      :description="description"
      :valid="descValid"
      @on-changed="onDescriptionChanged"
    />
    <MetaAttributes
      :attributes="attributes"
      :valid="attrValid"
      @on-changed="onAttributesChanged"
    />
    <div class="content panel-upload--content">
      <div
        class="panel-upload--dropzone"
        :class="{ active: isDragged }"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @drop.prevent="onDropHandler"
        @dragover.prevent
      >
        <input type="file" ref="fileRef" @change="onFileChangedHandler" />
        <div class="dropzone-label" @click="openSelectFile">
          <i-mdi-timer-sand v-if="fileCount > 0" class="icon-color" />
          <i-mdi-upload v-else class="icon-color" />
          <span>Drop file here or click to select</span>

          <div class="dropzone-is-loading" :class="{ active: fileCount > 0 }">
            <div class="dropzone-loading--bar"></div>
          </div>
          <span v-show="fileCount > 0"> NFT being created... </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, inject, ref } from "vue";

import { useStore } from "@src/store";
import { uploadBlob } from "@src/services/ipfs.js";
import { fileSize } from "@src/services/helpers";
import { useRebelStore } from "@src/store/index";
import { storeToRefs } from "pinia";
import MetaName from "@src/components/VUpload/MetaName.vue";
import MetaAttributes from "@src/components/VUpload/MetaAttributes.vue";
import MetaDescription from "@src/components/VUpload/MetaDescription.vue";

export default {
  name: "PanelUpload",
  emits: ["post-event"],
  components: {
    MetaName,
    MetaAttributes,
    MetaDescription,
  },
  setup(props, context) {
    const notyf = inject("notyf");
    const fileRef = ref(null);
    const isDragged = ref(false);
    const finished = ref(0);
    const isUploading = ref(false);
    const { postContent, getPostsByOwner } = useRebelStore();
    const rebelStore = useRebelStore();
    const { account } = storeToRefs(rebelStore);
    const name = ref("");
    const description = ref("");
    const attributes = ref(
      '[{"trait_type": "CHANGE_ME", "value": "CHANGE_ME"}]'
    );
    const nameValid = ref(false);
    const descValid = ref(false);
    const attrValid = ref(false);

    const store = useStore();

    const onNameChanged = ($event) => {
      name.value = $event.target.value;
      if (
        name.value.match(
          /^(?=.{3,30}$)[A-Za-z0-9_.\-'#!? ]*[A-Za-z0-9][A-Za-z0-9_.\-'#!? ]*$/
        )
      ) {
        nameValid.value = true;
      } else {
        nameValid.value = false;
      }
    };

    const onDescriptionChanged = ($event) => {
      description.value = $event.target.value;
      if (
        description.value.match(
          /^(?=.{3,90}$)[A-Za-z0-9_.\-'#!? ]*[A-Za-z0-9][A-Za-z0-9_.\-'#!? ]*$/
        )
      ) {
        descValid.value = true;
      } else {
        descValid.value = false;
      }
    };

    const onAttributesChanged = ($event) => {
      attributes.value = $event.target.value;
      try {
        const validJson = JSON.parse(attributes.value);
        if (Array.isArray(validJson)) {
          validJson.forEach((element) => {
            if (typeof element === "object") {
              if ("trait_type" in element && "value" in element) {
                attrValid.value = true;
              } else {
                throw "missing req object keys";
              }
            } else {
              throw "element is not an object";
            }
          });
        } else {
          throw "not a json array";
        }
      } catch {
        attrValid.value = false;
      }
    };

    const onDropHandler = ($event) => {
      if (isUploading.value) return false;

      isDragged.value = false;

      fileRef.value.files = $event.dataTransfer.files;

      onFileChangedHandler();
    };
    const openSelectFile = () => {
      if (isUploading.value) return false;

      fileRef.value.click();
    };
    const onDragEnter = () => {
      isDragged.value = true;
    };
    const onDragLeave = () => {
      isDragged.value = false;
    };

    /**
     * @param {File} file
     */
    const uploadFileHandler = async (file) => {
      const result = await uploadBlob(
        file,
        name.value,
        description.value,
        attributes.value
      );
      const { data } = result;
      const { error } = result;

      // figure out how to handle cancelled tx's by user
      if (!error) {
        try {
          await postContent(
            name.value,
            data.fileCid,
            data.metaCid,
            data.fileType
          );
          getPostsByOwner(account._rawValue);
        } catch (err) {
          notyf.error(`tx cancelled by user`);
        }
      }

      finished.value++;

      if (error && error instanceof Error) notyf.error(error.message);

      context.emit("post-event", true);
      return result;
    };
    const onFileChangedHandler = async () => {
      isUploading.value = true;

      if (nameValid.value && descValid.value && attrValid.value) {
        store.addFiles(...fileRef.value.files);
        const files = store.files.map((file) => uploadFileHandler(file));

        try {
          let results = await Promise.all(files);
          const unsuccessfully = results.filter(({ error }) => error.message);
          store.resetFiles();
          fileRef.value.value = null;

          if (unsuccessfully.length == 0) {
            notyf.success(`NFT successfully created!`);
          }
        } catch (error) {
          finished.value = 0;
          isUploading.value = false;
          store.resetFiles();
        } finally {
          finished.value = 0;
          isUploading.value = false;
        }
      } else {
        notyf.error(`fix input values and try again`);
        finished.value = 0;
        isUploading.value = false;
        fileRef.value.value = null;
        store.resetFiles();
      }
    };

    const fileCount = computed(() => {
      return store.files.length;
    });

    return {
      finished,
      fileRef,
      fileCount,
      isDragged,
      fileSize,
      onDragEnter,
      onDragLeave,
      onDropHandler,
      openSelectFile,
      onFileChangedHandler,
      name,
      description,
      attributes,
      onNameChanged,
      onDescriptionChanged,
      onAttributesChanged,
      nameValid,
      descValid,
      attrValid,
    };
  },
};
</script>

<style lang="scss">
section#panel-upload {
  background-color: var(--gradient-100);
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  align-content: center;

  .panel-upload--content,
  .panel-upload--content .panel-upload--dropzone {
    width: 100%;
    height: 70%;
  }

  .panel-upload--dropzone {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    padding-top: 25px;
    padding-bottom: 25px;

    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;

    &.active {
      > * {
        pointer-events: none;
      }

      .dropzone-label {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }

    input {
      display: none;
    }
    .dropzone-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.8rem;
      border-radius: 0.5rem;
      text-align: center;
      width: 80%;

      svg {
        height: 48px;
        width: 48px;
        margin-bottom: 1rem;
      }

      span {
        font-size: 0.8rem;
      }
    }
    .dropzone-details {
      position: absolute;
      display: flex;

      bottom: 1rem;
      left: 1rem;

      .dropzone-detail {
        background-color: var(--gradient-300);
        border-radius: 1rem;
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
        margin-right: 0.6rem;
      }
    }

    .dropzone-is-loading {
      opacity: 0;

      position: relative;
      height: 4px;
      display: block;
      width: 150px;
      background-color: var(--gradient-300);
      border-radius: 2px;
      margin: 1rem 0 1rem 0;
      overflow: hidden;

      &.active {
        opacity: 1;
      }

      .dropzone-loading--bar {
        background-color: var(--gradient-800);

        &:before {
          content: "";
          position: absolute;
          background-color: inherit;
          top: 0;
          left: 0;
          bottom: 0;
          will-change: left, right;
          animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
            infinite;
        }
        &:after {
          content: "";
          position: absolute;
          background-color: inherit;
          top: 0;
          left: 0;
          bottom: 0;
          will-change: left, right;
          animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
            infinite;
          animation-delay: 1.15s;
        }
      }
    }
  }
}

body.dark-theme {
  section#panel-upload {
    background-color: var(--gradient-800);

    .dropzone-details .dropzone-detail {
      background-color: var(--gradient-900);
    }
    .dropzone-is-loading {
      background-color: var(--gradient-700);

      .dropzone-loading--bar {
        background-color: var(--icon-color);
      }
    }
  }
}

@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}

@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}
</style>
