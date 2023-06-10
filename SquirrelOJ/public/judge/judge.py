import subprocess  # 匯入subprocess模組(執行其他py檔)
import time
with open('code.txt', 'r') as code:
    ex_code = code.read()  # 讀入使用者輸入的code.txt

with open('code_user.py', 'w') as code:
    code.write(ex_code)  # 將code.txt轉為code_user.py

with open('input.txt', 'r') as input:
    ex_input = input.read().strip()  # 讀入測資

start = time.perf_counter()

try:
    result = subprocess.run(['python', "code_user.py"], input=ex_input, timeout=3,
                            capture_output=True, text=True, check=True)  # 執行code_user.py檔,並將測資丟進去跑
except subprocess.CalledProcessError as e:
    print(e.stderr)
    exit()
except (subprocess.TimeoutExpired, RuntimeError):  # 如果超時的話
    print("TLE")
    exit()

end = time.perf_counter()

output = result.stdout.strip()  # code_user.py的輸出結果

with open('answer.txt', 'r') as ans:  # 讀入正確答案
    ex_ans = ans.read()

# print(output)   #-
# print("------")     #-
# print(ex_ans)       #-
# print("------")     #-輸出「code_user.py的輸出結果」與「正確答案」(若超時則輸出TLE)
if output == ex_ans:  # 判斷兩者是否相同，相同輸出True
    print("True(%f)" % (end-start))
else:
    print("False(%f)" % (end-start))
