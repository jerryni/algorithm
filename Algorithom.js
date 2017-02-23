class Algorithom {
    constructor(){}

    /**
     * Ease calculator 字符串加减法 计算器
     * 
     * https://leetcode.com/problems/basic-calculator/?tab=Description
     *
     * 原理解释：
     * 
     * - 数之间都用加法进行，用一个正负标志进行区分sign
     * - 遇到符号就说明number结束了， 进行一次累加计算并且重置number
     * - 遇到左括号就把之前的result和sign存起来
     * - 遇到右括号就把括号里的结果(result*括号之前的sign),然后再与之前的结果相加
     * - 循环结束后把最后的数字再累加一次
     *
     * 另一种思路(未实现)：
     * - 可以把括号前的符号记录下来，然后与括号里的+/-符号进行计算，得到是+/-， 比如负负得正
     * - 再进行普通的累加
     * 
     * @example
     * "1 + 1" = 2
     * " 2-1 + 2 " = 3
     * "(1+(4+5+2)-3)+(6+8)" = 23
     * 
     * @param  {String} s
     * @return {Number}
     */
    calculate(s){
        var i,
            c,
            sign = 1,
            result = 0,
            number = 0,
            stack = []

        if(!s || !s.length) {
            return 0
        }

        for(i=0; i < s.length;i++){
            c = s[i];

            if(/^[0-9]+$/.test(c)){
                number = number * 10 + parseInt(c);
            } else if(c == '+' || c== '-') {
                result += sign * number
                sign = c == '+' ? 1 : -1
                number = 0
            } else if(c == '(') {
                stack.push(result)
                stack.push(sign)

                sign = 1              
                number = 0
                
                result = 0 // the result in parenthesis
            } else if(c == ')') {
                result += sign * number // result in parenthesis
                number = 0
                sign = 1
                result *= stack.pop() // the sign before parenthesis
                result += stack.pop() // add result in/before parentthesis together
            }
        }

        result += sign * number

        return result;
    }

    /**
     * htmlAstParser 
     *
     * @example
     * `<div>
            inputbeforeContent
            <input r-value="{name}" />
            <p id="content">
                <span>333</span>
                <span style="display:block;">
                    描述信息2
                    <span>{name}</span>
                </span>
            </p>
        </div>`

     * ```js
        [{
            "tagName": "div",
            "attrs": [],
            "children": [{
                "type": "textNode",
                "value": "\n            inputbeforeContent\n            "
            }, {
                "tagName": "input",
                "attrs": [{
                    "attrName": "r-value",
                    "value": "{name}"
                }]
            }, {
                "type": "textNode",
                "value": "\n            "
            }, {
                "tagName": "p",
                "attrs": [{
                    "attrName": "id",
                    "value": "content"
                }],
                "children": [{
                    "type": "textNode",
                    "value": "\n                "
                }, {
                    "tagName": "span",
                    "attrs": [],
                    "children": [{
                        "type": "textNode",
                        "value": "333"
                    }]
                }, {
                    "type": "textNode",
                    "value": "\n                "
                }, {
                    "tagName": "span",
                    "attrs": [{
                        "attrName": "style",
                        "value": "display:block;"
                    }],
                    "children": [{
                        "type": "textNode",
                        "value": "\n                    描述信息2\n                    "
                    }, {
                        "tagName": "span",
                        "attrs": [],
                        "children": [{
                            "type": "textNode",
                            "value": "{name}"
                        }]
                    }]
                }]
            }]
        }]
     * ```
     * @param  {String} htmlStr 
     * @return {Object}         ast
     */
    htmlAstParser(htmlStr) {

        var regs = {

            // 自闭合标签
            selfCloseTag: /<(\w+)([^<]*)\/>/i,

            // 开标签
            startTag: /(^[^<>]*)<(\w+)([^<]*)>/i,

            // 标签结尾
            closeTag: /^([^<>]*)<\/(\w+)>/i
        },
        ast = []

        // 先写出整体的tag， 内容/属性先忽略
        function parse(_ast){
            var match = regs.startTag.exec(htmlStr)

            if (match) {
                var macthedTotalStr = match[0],
                    beforeStartTagTextNode = match[1] || '',
                    tagName = match[2],
                    newAst,
                    node,
                    newMatch,
                    subMatch,
                    attrs = []

                // 开标签前的文本内容
                if(beforeStartTagTextNode){
                    _ast.push({
                        type: 'textNode',
                        value: beforeStartTagTextNode
                    })
                }

                // 是否是自闭合标签
                if (subMatch = regs.selfCloseTag.exec(macthedTotalStr)) {
                    attrs = subMatch[2].trim().split(' ');
                    attrs = attrs.map(item => {
                        return {
                            attrName: item.split('=')[0],
                            value: item.split('=')[1].replace(/"/g,'')
                        }
                    })

                    _ast.push({
                        tagName,
                        attrs
                    })

                    // 截取掉匹配过的内容
                    htmlStr = htmlStr.slice(match.index + macthedTotalStr.length)

                    newAst = _ast // 用原来的节点

                } else { //开标签 创建一个tagName, children
                    
                    // 添加属性
                    if(match[3]) {
                        attrs = match[3].trim().split(' ');

                        attrs = attrs.map(item => {
                            return {
                                attrName: item.split('=')[0],
                                value: item.split('=')[1].replace(/"/g,'')
                            }
                        })    
                    }
                    
                    node = {
                        tagName,
                        attrs,
                        children: []
                    };

                    // 截取掉匹配过的内容
                    htmlStr = htmlStr.slice(match.index + macthedTotalStr.length)

                    // 匹配到下一个是否是闭合标签，如果是就按照自闭合标签处理
                    newMatch = regs.closeTag.exec(htmlStr)
                    if(newMatch){

                        // 标签名相同 说明是匹配的一对
                        if(newMatch[2] == tagName){
                            htmlStr = htmlStr.slice(newMatch.index + newMatch[0].length)
                            if(newMatch[1]){
                                node.children.push({
                                    type: 'textNode',
                                    value: newMatch[1]
                                })
                            }

                            _ast.push(node)
                            newAst = _ast // 用原来的节点
                        }
                    } else{

                        _ast.push(node)
                        newAst = node.children // 用新的节点
                    }
                }

                // 进入递归
                return parse(newAst)
            } else {
                return ast
            }
        }

        return parse(ast);
    }
}