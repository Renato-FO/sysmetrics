<p align="center">
  <br />
  <h1>📊 sysmetrics</h1>
  Uma biblioteca moderna e multiplataforma para monitoramento de métricas de sistema e informações de hardware, escrita em TypeScript para Node.js.
</p>

[](https://www.google.com/search?q=https://www.npmjs.com/package/sysmetrics)
[](https://www.google.com/search?q=https://github.com/seu-usuario/sysmetrics/actions)
[](https://opensource.org/licenses/MIT)

---

## 🚀 Demonstração

<p align="center">
  <img src="./src/assets/example.gif" alt="Demonstration of sysmetrics" width="700">
</p>

## ✨ Sobre a Biblioteca

`sysmetrics` é uma biblioteca leve e sem dependências para monitorar a performance do sistema e obter informações de hardware em tempo real. Ela abstrai os complexos comandos específicos de cada sistema operacional, fornecendo uma API limpa, assíncrona e fácil de usar.

Foi projetada para ser a espinha dorsal de dashboards de monitoramento, modelos preditivos de IA e qualquer aplicação que precise entender o ambiente de hardware em que está operando.

---

## 📦 Instalação

```bash
npm install sysmetrics
```

_(Nota: Pacote ainda não publicado)_

---

## ⚡ Guia Rápido

Começar a usar a `sysmetrics` é simples. Importe o objeto principal e chame os métodos que precisar.

```typescript
import { sysmetrics } from "sysmetrics";

async function logSystemSnapshot() {
  try {
    // 1. Obter informações estáticas do hardware
    const system = await sysmetrics.getSystemInfo();
    console.log(`System: ${system.cpu} on ${system.motherboard}`);

    // 2. Obter métricas dinâmicas
    const cpuUsage = await sysmetrics.getCpuUsage();
    const ram = await sysmetrics.getMemoryUsage();

    // 3. Obter métricas da GPU
    // A função getGpuInfo() retorna um objeto com métodos específicos
    const gpuController = sysmetrics.getGpuInfo();
    const gpuStats = await gpuController.getCurrentGpuStats();

    console.log(`\nCPU: ${cpuUsage}% | RAM: ${ram.used}MB / ${ram.total}MB`);
    console.log(`GPU: ${system.gpu}`);
    console.log(
      `  - Temp: ${gpuStats.temperature}°C, VRAM Used: ${gpuStats.vramUsed}MB`
    );

    // 4. Obter os processos que mais consomem memória
    const topProcesses = await sysmetrics.getTopProcesses({ sortBy: "memory" });
    console.log("\nTop Memory Processes:", topProcesses);
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
  }
}

logSystemSnapshot();
```

---

## 📋 Funcionalidades

- **✅ Informações do Sistema:** Obtenha dados estáticos sobre CPU, placa-mãe e GPU.
- **✅ Monitoramento de CPU:** Acompanhe o uso percentual em tempo real.
- **✅ Monitoramento de RAM:** Veja a memória total, usada e livre.
- **✅ Monitoramento de GPU:**
  - Detecção inteligente de fabricante (NVIDIA, AMD, Intel).
  - Dados de temperatura, uso de VRAM e carga da GPU (quando disponível).
- **✅ Análise de Processos:** Liste os processos que mais consomem recursos, agrupados por aplicação.
- **💻 Suporte Multiplataforma:** Arquitetura pronta para Windows, Linux e macOS.

| Métrica                 | Windows | Linux | macOS |
| :---------------------- | :-----: | :---: | :---: |
| **Info Estática**       |   ✅    |  ⏳   |  ⏳   |
| **CPU / RAM**           |   ✅    |  ⏳   |  ⏳   |
| **Processos**           |   ✅    |  ⏳   |  ⏳   |
| **GPU (NVIDIA)**        |   ✅    |  ✅   |  ❌   |
| **GPU (AMD)**           |   ✅    |  ✅   |  ❌   |
| **GPU (Intel / Apple)** |   ✅    |  ⏳   |  ✅   |

_(✅ = Implementado, ⏳ = Em Desenvolvimento, ❌ = Não Aplicável)_

---

## 🛣️ Roadmap

- [x] **Implementação Principal (Windows)**
- [ ] **Suporte Completo para Linux & macOS**
- [ ] **Suíte de Testes com Vitest/Jest**
- [ ] **Documentação da API com TSDoc**
- [ ] **Publicação da v1.0.0 no NPM**

---

## 🤝 Contribuindo

Contribuições são o que tornam a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um Fork do Projeto
2.  Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Faça o Commit de suas alterações (`git commit -m 'Add some AmazingFeature'`)
4.  Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5.  Abra um Pull Request

---

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
