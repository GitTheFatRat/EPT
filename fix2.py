import re

with open('FE/src/features/result/ResultPage.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_map = False
for line in lines:
    if '{detailAnswers?.map((item, idx) => {' in line:
        in_map = True
        new_lines.append(line.replace('{detailAnswers?.map((item, idx) => {', '{(() => { const renderItem = (item, idx) => {'))
        continue
    if in_map and line.strip() == '})}':
        new_lines.append(line.replace('})}', '}; if (skill === \"overall\") { return (<>{detailAnswers?.filter(a=>a.skill===\"reading\").length > 0 && <div className=\"mb-10\"><h3 className=\"text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200\">Reading Section</h3><div className=\"space-y-6\">{detailAnswers.filter(a=>a.skill===\"reading\").map((item, idx) => renderItem(item, idx))}</div></div>} {detailAnswers?.filter(a=>a.skill===\"listening\").length > 0 && <div><h3 className=\"text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200\">Listening Section</h3><div className=\"space-y-6\">{detailAnswers.filter(a=>a.skill===\"listening\").map((item, idx) => renderItem(item, idx))}</div></div>}</>); } return detailAnswers?.map((item, idx) => renderItem(item, idx)); })()}'))
        in_map = False
        continue
    new_lines.append(line)

with open('FE/src/features/result/ResultPage.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
