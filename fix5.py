import re

with open('FE/src/features/result/ResultPage.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('})()\n          </div>', '})()}\n          </div>')

with open('FE/src/features/result/ResultPage.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
