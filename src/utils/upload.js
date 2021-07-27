import { request } from "nfeng-axios";
import * as imageConversion from 'image-conversion';

export default {
  methods: {
    // 取字母和数字的随机8位数
    randomWord(randomFlag, min, max) {
      let str = "",
        range = min,
        arr = [
          'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
          'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
          'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
          'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',];

      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;// 任意长度
      }
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },
    beforeUpload(file) {
      let type = false;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/pdf";
      if (!isJPG) {
        this.$message.error("仅支持jpg/png/pdf格式!");
        return type;
      }
      const isLt2M = file.size / 1024 / 1024 < this.fileSize;
      if (!isLt2M) {
        this.$message.error(`上传不能超过${this.fileSize}MB!`);
        return type;
      }
      type = request({
        url: "/bciscm/upload/tokenV2",
        method: "GET"
      }).then(({ data, code }) => {
        if (code === 0) {
          const { uploadToken, openDomain, dir } = data;
          let type = file.type && file.type.split('/');
          let name = `${this.randomWord(false, 8)}.${type[1]}`;
          this.postData = {
            token: uploadToken,
            key: `${dir}${name}`
          };
          this.openDomain = openDomain;
          this.dir = dir;
          return this.compressUpload(file)
          // return true;
        } else {
          return false;
        }
      });
      return type;
    },
    compressUpload(file) {
      //图片大小超过4M,长度超过2000就压缩
      return new Promise((resolve) => {
        let _URL = window.URL || window.webkitURL
        let isLt2M = file.size / 1024 / 1024 > 10 // 判定图片大小是否小于10MB
        // 这里需要计算出图片的长宽
        let img = new Image()
        img.onload = () => {
          file.width = img.width // 获取到width放在了file属性上
          file.height = img.height // 获取到height放在了file属性上
          let valid = img.width > 1000 // 图片宽度大于2000
          // console.log('压缩前', file)
          // 这里我只判断了图片的宽度,compressAccurately有多个参数时传入对象
          if (valid || isLt2M) {
            // 大小在500k以下，宽度1000以下
            imageConversion.compressAccurately(file, {
              size: 500,
              width: 1000
            }).then(res => {
              // console.log('压缩后', res)
              resolve(res)
            })
          } else {
            resolve(file)
          }
        } // 需要把图片赋值
        img.src = _URL.createObjectURL(file)
      })
    }
  }
}