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
}