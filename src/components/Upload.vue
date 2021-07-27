<template>
  <div>
    <el-upload
      ref="upload"
      :multiple="true"
      :limit="5"
      :disabled="disabled"
      :action="uploadDomain"
      :file-list="fileList"
      :data="postData"
      :on-preview="handlePreview"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-remove="handleRemove"
      :class="{
        'upload--disabled': disabled,
        'upload--hide': detail || fileList.length >=5,
        'upload--close': close
      }"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">支持文件格式：.jpg .png .pdf，单个文件不能超过{{fileSize}}MB，最多上传5张。</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="图片" />
    </el-dialog>
  </div>
</template>

<script>
import upload from "@/utils/upload.js";
import { request } from "nfeng-axios";

export default {
  name: "YgpUpload",
  mixins: [upload],
  props: {
    detail: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    value: {},
    close: {
      type: Boolean,
    },
    fileSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      uploadDomain: "https://upload-z2.qiniup.com",
      openDomain: "",
      dir: "",
      postData: {},
      fileList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        this.initData(val);
      },
    },
  },
  created() {
    this.initData(this.value);
  },
  methods: {
    initData(value) {
      let _that = this;
      if (Array.isArray(value)) {
        _that.fileList = value.map((item) => {
          return {
            ...item,
            url: item.url || item.filePath,
            name: item.name || item.fileName,
          };
        });
      }
    },
    uploadSuccess(response, file, fileList) {
      this.$message.success("上传成功！");
      const newFileList = fileList.map((item) => {
        const fileName = item.fileName || (response && response.fname);
        const filePath = item.filePath || `${this.openDomain}/${response.key}`;
        const fileKey = response.key;
        const fileSize = item.fileSize || (response && response.fsize);
        const fileType = item.fileType || (response && response.mimeType);
        return {
          ...item,
          fileName,
          filePath,
          fileKey,
          fileSize,
          fileType,
        };
      });
      this.fileList = newFileList;
      this.$emit("input", newFileList);
      this.$emit("change", newFileList, this.openDomain);
      this.$emit("validateField");
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.$emit("input", fileList);
      this.$emit("change", fileList);
      this.$emit("validateField");
    },
    handlePreview(file) {
      const privateFileKey = file.fileKey || file.filePath
      request({
        url: `/bciscm/upload/getPrivateDownloadUrl?privateFileKey=${privateFileKey}`,
        method: "GET",
      }).then((res) => {
        let url = res.data;
        if (file.fileType === "application/pdf") {
          window.open(url);
          return;
        }
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      });
    },
  },
};
</script>
<style lang="scss">
.upload--disabled {
  .el-upload--picture-card {
    display: none;
  }
  .el-upload,
  .el-upload__tip {
    display: none;
  }
  .el-upload-list__item:first-child {
    margin-top: 4px;
  }
}

.upload--hide {
  .el-upload,
  .el-upload__tip {
    display: none;
  }
  .el-upload-list__item:first-child {
    margin-top: 4px;
  }
}

.upload--close {
  .el-upload-list__item-status-label,
  .el-icon-close {
    display: none !important;
  }
}

.el-icon-close-tip {
  display: none !important;
}
</style>
