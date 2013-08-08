augroup ExtraFileTypes
  autocmd!
  autocmd BufRead,BufNewFile *_test.js set ft+=.qunit
augroup end

set wig=node_modules/**,tmp/**,dist/**
" Disable syntastic with es6 modules
let g:syntastic_disabled=1

" Project is small; fine to always flush
nmap <leader>t :CommandTFlush<CR>:CommandT<CR>
