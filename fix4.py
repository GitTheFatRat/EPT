import re

with open('FE/src/features/result/ResultPage.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('{detailAnswers?.map((item, idx) => {', '{(() => { const renderItem = (item, idx) => {', 1)

idx = code.rfind('            })}')
if idx != -1:
    before = code[:idx]
    after = code[idx+15:]
    replacement = '            }; if (skill === \"overall\") { return (<>{detailAnswers?.filter(a=>a.skill===\"reading\").length > 0 && <div className=\"mb-10\"><h3 className=\"text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200\">Reading Section</h3><div className=\"space-y-6\">{detailAnswers.filter(a=>a.skill===\"reading\").map((item, idx) => renderItem(item, idx))}</div></div>} {detailAnswers?.filter(a=>a.skill===\"listening\").length > 0 && <div><h3 className=\"text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200\">Listening Section</h3><div className=\"space-y-6\">{detailAnswers.filter(a=>a.skill===\"listening\").map((item, idx) => renderItem(item, idx))}</div></div>}</>); } return detailAnswers?.map((item, idx) => renderItem(item, idx)); })()'
    code = before + replacement + after

with open('FE/src/features/result/ResultPage.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
