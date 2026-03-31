# Gerador de Orçamentos - Claudio Móveis

Uma aplicação web simples, rápida e intuitiva para gerar orçamentos em PDF com a identidade visual da **Claudio Móveis Sob Medidas**. Desenvolvido com o objetivo de facilitar a criação de orçamentos diretamente pelo celular ou computador, substituindo ferramentas complexas por uma solução automatizada e ágil!

## 🚀 Como usar

1. **Acesse o sistema:** [https://stheeCamile.github.io/orcamentos/](https://stheeCamile.github.io/orcamentos/)
2. **Preencha:** Coloque os dados do cliente, escolha os itens que farão parte do escopo *(ex: Despesas com Materiais, Mão de Obra, etc)*.
3. **Download Rápido:** Clique no botão azul superior (**BAIXAR PDF**).
4. **Envie:** O gerador deixará o formato impecável (Ultra HD, tamanho A4), pronto para ser mandado via WhatsApp ou Email!

## 🛠 Principais Facilidades e Ferramentas

- **Cálculo Matemático Instantâneo:** Adicione itens e veja a soma aparecendo automaticamente no *Custo Total*.
- **Otimizado para Celulares:** Usou pelo celular? Ele se adapta e reescreve a tela perfeitamente!
- **Zero Configurações Manuais de Papel:** Possui inteligência na impressão (quebra de página automática caso o orçamento fique longo sem "cortar a linha" no meio).
- **Rodando sem Custos de Servidor:** Utiliza o modelo estático (`HTML`, `CSS` e `JS`), o que torna a hospedagem no GitHub Pages 100% gratuita, rápida e infinita!

## 💻 Para Desenvolvedores (Rodando Localmente)

Pelo fato da tecnologia Web bloquear o download do PDF e de imagens externas no modo "Desktop Offline" (aquelas URLs do tipo `file:///C:/...`), utilize um servidor local para aplicar correções visuais e testar o gerador.

1. Clone o projeto:
```bash
git clone https://github.com/stheeCamile/orcamentos.git
```
2. Abra um servidor local na pasta do projeto (recomendamos Node via `npx serve` ou a extensão do VSCode `Live Server`).
3. Modifique `index.html` e `style.css` para edições estéticas e `script.js` para refinar ou injetar maior lógica no exportador de PDF (`html2pdf.js`).
4. Dê `Commit & Push` e o GitHub Pages atualizará o projeto na nuvem!
