# 将Excel表格数据转化为JSON#

本文介绍当产品给你一个表格，你要将表格里的数据以某种形式呈现到网页上时，不要傻傻地用手敲，用工具转换会比较方便。

Mac环境下，用Numbers打开表格，表格第一行改为JSON数据中的key值，比如：

![Numbers](http://ww1.sinaimg.cn/large/6e453469gw1f423bxsvezj20j2018q2y.jpg)

然后依次选择 File->Export To->CSV，将文件转化CSV格式。CSV文件是可以直接转化为JSON格式的，比如到 [CSVJSON](http://www.csvjson.com/csv2json) 站点，添加文件之后，选择根据逗号分隔数据，可以得到一串JSON直接使用。

也可以再写段脚本转化为其他所需要的格式。