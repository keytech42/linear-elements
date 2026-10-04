import { defineConfig } from 'vite';

// GitHub Pages는 사이트를 https://<계정>.github.io/<저장소>/ 아래에 올린다.
// 상대 경로(base: './')로 빌드하면 저장소 이름이 바뀌어도 그대로 동작한다.
// 화면 이동은 해시(#/n/…)로만 하므로, 어느 주소로 들어와도 index.html 하나로 충분하다.
export default defineConfig({
  base: './',
});
