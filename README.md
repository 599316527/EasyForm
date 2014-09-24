EasyForm
========

A simple way to create forms.

## usage

引入ESL(一个AMD模块加载器)：

    <script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-6-10/esl.source.js"></script>

使用EasyForm：

    <script type="text/javascript">
        // 配置esl
        require.config({
            paths: {
                'EasyForm': 'http://your.server/dist/EasyForm-0.0.1.min'
            }
        });
        require(['EasyForm'] , function(EasyForm) {
            var schema = [
                {
                    "name": "logo",
                    "displayName": "LOGO",
                    "datatype": "OBJECT",
                    "rules": {},
                    "items": [
                        {
                            "name": "name",
                            "displayName": "姓名",
                            "tip": "最多10个字节（5个汉字）",
                            "datatype": "STRING",
                            "rules": {
                                "required": true,
                                "maxByteLength": 10
                            }
                        },
                        {
                            "name": "addr",
                            "displayName": "住址",
                            "tip": "最多100个字节（50个汉字）",
                            "datatype": "STRING",
                            "rules": {
                                "required": true,
                                "maxByteLength": 100
                            }
                        }
                    ]
                }
            ];
            var easyform = new EasyForm(schema);

            easyform.render(document.getElementById('canvas'));
        });
    </script>

## build

    npm install -g edp
    edp import esui est
    edp build -f --stage=release

dist/EasyForm-{version}.js 就是最终打包后的JS，引入到项目即可
