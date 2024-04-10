How to generate source files and basic tailwind css in dist for local dev
- pnpm dev
- pnpm build:tailwindcss

后两个指令用来生成shadowRoot里的tailwindcss基础样式，
执行之后理论上不会重新生成contentStyle的css，
需要随便修改任意一个pages/content下的文件才能自动生成新的基础样式
这里不知道为什么 tailwind.config.js 里不能单独引用某个组件，只能全部引用，
但因为是文件不是inline style，所以有缓存问题不大

很复杂，而且后三个指令应该有某种办法合并到第一个，但考虑到如果不增加新的组件，应该可以
一直不修改contentStyle.css，也就不用重新跑这个流程
