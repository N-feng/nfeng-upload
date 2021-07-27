(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@/utils/upload.js'), require('nfeng-axios')) :
  typeof define === 'function' && define.amd ? define(['@/utils/upload.js', 'nfeng-axios'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.App = factory(global.upload, global.nfengAxios));
}(this, (function (upload, nfengAxios) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var upload__default = /*#__PURE__*/_interopDefaultLegacy(upload);

  //

  var script = {
    name: "YgpUpload",
    mixins: [upload__default['default']],
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
        const privateFileKey = file.fileKey || file.filePath;
        nfengAxios.request({
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

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function (context) {
        style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }

  var HEAD;
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);

        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }

        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _c(
          "el-upload",
          {
            ref: "upload",
            class: {
              "upload--disabled": _vm.disabled,
              "upload--hide": _vm.detail || _vm.fileList.length >= 5,
              "upload--close": _vm.close
            },
            attrs: {
              multiple: true,
              limit: 5,
              disabled: _vm.disabled,
              action: _vm.uploadDomain,
              "file-list": _vm.fileList,
              data: _vm.postData,
              "on-preview": _vm.handlePreview,
              "before-upload": _vm.beforeUpload,
              "on-success": _vm.uploadSuccess,
              "on-remove": _vm.handleRemove
            }
          },
          [
            _c("el-button", { attrs: { size: "small", type: "primary" } }, [
              _vm._v("点击上传")
            ]),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "el-upload__tip",
                attrs: { slot: "tip" },
                slot: "tip"
              },
              [
                _vm._v(
                  "支持文件格式：.jpg .png .pdf，单个文件不能超过" +
                    _vm._s(_vm.fileSize) +
                    "MB，最多上传5张。"
                )
              ]
            )
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-dialog",
          {
            attrs: { visible: _vm.dialogVisible },
            on: {
              "update:visible": function($event) {
                _vm.dialogVisible = $event;
              }
            }
          },
          [
            _c("img", {
              attrs: { width: "100%", src: _vm.dialogImageUrl, alt: "图片" }
            })
          ]
        )
      ],
      1
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-1f2c8db2_0", { source: ".upload--disabled .el-upload--picture-card {\n  display: none;\n}\n.upload--disabled .el-upload,\n.upload--disabled .el-upload__tip {\n  display: none;\n}\n.upload--disabled .el-upload-list__item:first-child {\n  margin-top: 4px;\n}\n.upload--hide .el-upload,\n.upload--hide .el-upload__tip {\n  display: none;\n}\n.upload--hide .el-upload-list__item:first-child {\n  margin-top: 4px;\n}\n.upload--close .el-upload-list__item-status-label,\n.upload--close .el-icon-close {\n  display: none !important;\n}\n.el-icon-close-tip {\n  display: none !important;\n}\n\n/*# sourceMappingURL=Upload.vue.map */", map: {"version":3,"sources":["/Users/n-feng/Documents/upload/src/components/Upload.vue","Upload.vue"],"names":[],"mappings":"AAsIA;EACA,aAAA;ACrIA;ADuIA;;EAEA,aAAA;ACrIA;ADuIA;EACA,eAAA;ACrIA;AD0IA;;EAEA,aAAA;ACvIA;ADyIA;EACA,eAAA;ACvIA;AD4IA;;EAEA,wBAAA;ACzIA;AD6IA;EACA,wBAAA;AC1IA;;AAEA,qCAAqC","file":"Upload.vue","sourcesContent":["<template>\n  <div>\n    <el-upload\n      ref=\"upload\"\n      :multiple=\"true\"\n      :limit=\"5\"\n      :disabled=\"disabled\"\n      :action=\"uploadDomain\"\n      :file-list=\"fileList\"\n      :data=\"postData\"\n      :on-preview=\"handlePreview\"\n      :before-upload=\"beforeUpload\"\n      :on-success=\"uploadSuccess\"\n      :on-remove=\"handleRemove\"\n      :class=\"{\n        'upload--disabled': disabled,\n        'upload--hide': detail || fileList.length >=5,\n        'upload--close': close\n      }\"\n    >\n      <el-button size=\"small\" type=\"primary\">点击上传</el-button>\n      <div slot=\"tip\" class=\"el-upload__tip\">支持文件格式：.jpg .png .pdf，单个文件不能超过{{fileSize}}MB，最多上传5张。</div>\n    </el-upload>\n    <el-dialog :visible.sync=\"dialogVisible\">\n      <img width=\"100%\" :src=\"dialogImageUrl\" alt=\"图片\" />\n    </el-dialog>\n  </div>\n</template>\n\n<script>\nimport upload from \"@/utils/upload.js\";\nimport { request } from \"nfeng-axios\";\n\nexport default {\n  name: \"YgpUpload\",\n  mixins: [upload],\n  props: {\n    detail: {\n      type: Boolean,\n    },\n    disabled: {\n      type: Boolean,\n    },\n    value: {},\n    close: {\n      type: Boolean,\n    },\n    fileSize: {\n      type: Number,\n      default: 10,\n    },\n  },\n  data() {\n    return {\n      dialogImageUrl: \"\",\n      dialogVisible: false,\n      uploadDomain: \"https://upload-z2.qiniup.com\",\n      openDomain: \"\",\n      dir: \"\",\n      postData: {},\n      fileList: [],\n    };\n  },\n  watch: {\n    value: {\n      handler(val) {\n        this.initData(val);\n      },\n    },\n  },\n  created() {\n    this.initData(this.value);\n  },\n  methods: {\n    initData(value) {\n      let _that = this;\n      if (Array.isArray(value)) {\n        _that.fileList = value.map((item) => {\n          return {\n            ...item,\n            url: item.url || item.filePath,\n            name: item.name || item.fileName,\n          };\n        });\n      }\n    },\n    uploadSuccess(response, file, fileList) {\n      this.$message.success(\"上传成功！\");\n      const newFileList = fileList.map((item) => {\n        const fileName = item.fileName || (response && response.fname);\n        const filePath = item.filePath || `${this.openDomain}/${response.key}`;\n        const fileKey = response.key;\n        const fileSize = item.fileSize || (response && response.fsize);\n        const fileType = item.fileType || (response && response.mimeType);\n        return {\n          ...item,\n          fileName,\n          filePath,\n          fileKey,\n          fileSize,\n          fileType,\n        };\n      });\n      this.fileList = newFileList;\n      this.$emit(\"input\", newFileList);\n      this.$emit(\"change\", newFileList, this.openDomain);\n      this.$emit(\"validateField\");\n    },\n    handleRemove(file, fileList) {\n      this.fileList = fileList;\n      this.$emit(\"input\", fileList);\n      this.$emit(\"change\", fileList);\n      this.$emit(\"validateField\");\n    },\n    handlePreview(file) {\n      const privateFileKey = file.fileKey || file.filePath\n      request({\n        url: `/bciscm/upload/getPrivateDownloadUrl?privateFileKey=${privateFileKey}`,\n        method: \"GET\",\n      }).then((res) => {\n        let url = res.data;\n        if (file.fileType === \"application/pdf\") {\n          window.open(url);\n          return;\n        }\n        this.dialogImageUrl = url;\n        this.dialogVisible = true;\n      });\n    },\n  },\n};\n</script>\n<style lang=\"scss\">\n.upload--disabled {\n  .el-upload--picture-card {\n    display: none;\n  }\n  .el-upload,\n  .el-upload__tip {\n    display: none;\n  }\n  .el-upload-list__item:first-child {\n    margin-top: 4px;\n  }\n}\n\n.upload--hide {\n  .el-upload,\n  .el-upload__tip {\n    display: none;\n  }\n  .el-upload-list__item:first-child {\n    margin-top: 4px;\n  }\n}\n\n.upload--close {\n  .el-upload-list__item-status-label,\n  .el-icon-close {\n    display: none !important;\n  }\n}\n\n.el-icon-close-tip {\n  display: none !important;\n}\n</style>\n",".upload--disabled .el-upload--picture-card {\n  display: none;\n}\n.upload--disabled .el-upload,\n.upload--disabled .el-upload__tip {\n  display: none;\n}\n.upload--disabled .el-upload-list__item:first-child {\n  margin-top: 4px;\n}\n\n.upload--hide .el-upload,\n.upload--hide .el-upload__tip {\n  display: none;\n}\n.upload--hide .el-upload-list__item:first-child {\n  margin-top: 4px;\n}\n\n.upload--close .el-upload-list__item-status-label,\n.upload--close .el-icon-close {\n  display: none !important;\n}\n\n.el-icon-close-tip {\n  display: none !important;\n}\n\n/*# sourceMappingURL=Upload.vue.map */"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  // Import vue component
  var components = [__vue_component__]; // will install the plugin only once

  var install = function install(Vue) {
    components.forEach(function (component) {
      Vue.component(component.name, component);
    });
  };

  if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
  } // To allow use as module (npm/webpack/etc.) export component


  var index = {
    install: install,
    Upload: __vue_component__
  }; // It's possible to expose named exports when writing components that can
  // also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
  // export const RollupDemoDirective = component;

  return index;

})));
