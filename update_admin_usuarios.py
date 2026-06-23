import re

with open('frontend/stitch_tailwind_blue_redesign/gesti_n_de_usuarios_redise_o/code.html', 'r', encoding='utf-8') as f:
    content = f.read()

main_match = re.search(r'(<main.*?>)(.*?)(</main>)', content, re.DOTALL)
if main_match:
    main_content = main_match.group(2)
else:
    main_content = "NOT FOUND"

print(main_content[:200])
