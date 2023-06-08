def fib(n):                         
    if n > 1:                       
        return fib(n-1) + fib(n-2)  
    return n
for i in range(38):
    print(fib(i),end=" ")