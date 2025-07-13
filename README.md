# Hub4u Dashboard

Dashboard administrativo para gerenciamento de restaurantes da plataforma Hub4u.

## 🚀 Tecnologias

- **Vue.js 3** - Framework JavaScript reativo
- **Quasar Framework** - Componentes UI e PWA
- **TypeScript** - Tipagem estática
- **Vuex** - Gerenciamento de estado
- **Vue Router** - Roteamento
- **Axios** - Cliente HTTP

## 📋 Funcionalidades

- ✅ Gestão de restaurantes
- ✅ Cardápio digital
- ✅ Gerenciamento de pedidos
- ✅ Controle de estoque
- ✅ Clientes e endereços
- ✅ Membros da equipe
- ✅ Horários de funcionamento
- ✅ Progressive Web App (PWA)

## 🔧 Desenvolvimento

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Variáveis de Ambiente
```bash
# .env.local (desenvolvimento)
GOOGLE_MAPS_KEY=your-development-key

# .env.production (produção)
GOOGLE_MAPS_KEY=your-production-key
```

## 🌐 Deploy no Render

### Configuração do Static Site

1. **Build Command**: `npm install && npm run build`
2. **Publish Directory**: `./dist/pwa`
3. **Environment Variables**:
   - `GOOGLE_MAPS_KEY`: Sua chave do Google Maps
   - `NODE_ENV`: `production`

### Redirects para SPA
O arquivo `render.yaml` está configurado para redirecionar todas as rotas para `index.html`, garantindo que o Vue Router funcione corretamente.

## 📱 PWA Features

- ✅ Instalável como app
- ✅ Funcionamento offline
- ✅ Notificações push
- ✅ Service Worker automático

## 🔗 API Integration

O dashboard se conecta com a API Hub4u:
- **Produção**: `https://xhub-api.onrender.com/api`
- **Desenvolvimento**: `http://localhost:3000/api`

## 📄 Estrutura do Projeto

```
src/
├── api/              # Serviços de API
├── boot/             # Plugins e configurações
├── components/       # Componentes reutilizáveis
├── layouts/          # Layouts da aplicação
├── pages/            # Páginas/Views
├── router/           # Configuração de rotas
├── store/            # Vuex store modules
└── css/              # Estilos globais
```

## 🐛 Troubleshooting

### Build Fails
```bash
# Limpar cache do Quasar
npx quasar clean

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
1. Verifique se a API está rodando
2. Confirme as variáveis de ambiente
3. Teste o endpoint de health: `/api/health`

## 📚 Documentação

- [Quasar Framework](https://quasar.dev/)
- [Vue.js 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)

## 👥 Equipe

Desenvolvido pela equipe Hub4u Digital

---
*Última atualização: Julho 2025*
