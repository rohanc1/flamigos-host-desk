#!/usr/bin/env python3
"""Concatenates src/ into public/app.js and public/styles.css, then writes a single-file preview (dist/preview.html)."""
import os,re
here=os.path.dirname(os.path.abspath(__file__))
r=lambda f:open(os.path.join(here,'src',f),encoding='utf8').read()
css=r('themes.css')+'\n'+r('css_v1.txt')+'\n'+re.sub(r'</?style>','',r('css_extra.html'))+'\n'+r('extra2.css')
js_order=['core.js','avatars.js','celebrate.js','score.js','board.js','views.js','app_a.js','app_b.js','awards.js','theme.js','sync.js']
js='\n'.join('/* ===== '+f+' ===== */\n'+(r(f).replace('__KEEP__',r('sheets_keep.js')) if f=='app_a.js' else r(f)) for f in js_order)
js="(function(){\n'use strict';\n"+js+"\n})();\n"
os.makedirs(os.path.join(here,'public'),exist_ok=True)
open(os.path.join(here,'public','styles.css'),'w',encoding='utf8').write(css)
open(os.path.join(here,'public','app.js'),'w',encoding='utf8').write(js)
print('styles.css',len(css),'app.js',len(js))
