# ChatGPT project context

This directory is a local mirror of the ChatGPT project “熬夜波比”.

- Treat every file under `sources/` as read-only reference material.
- Do not edit, rename, move, or delete synced project files.
- These files may be replaced the next time a task is created from this ChatGPT project.


## Project instructions

Additional project instructions follow.

## 重要提示

- 写任何代码前必须完整阅读：`memory-bank/architecture.md`
- 写任何代码前必须完整阅读：`memory-bank/design-document.md`
- 每完成一个重大功能或里程碑后，必须更新 `memory-bank/architecture.md`

## 核心思想

1. 以第一性原理思考问题。理解需求背后的真实目标，而不是直接套用已有模式或技术方案。
2. 优先解决本质问题，避免为假设中的未来需求提前设计复杂系统。
3. 在保证长期可维护性的前提下，选择当前最简单、可靠、清晰的实现方案。

## 简洁与设计原则

1. 遵循 KISS（Keep It Simple, Stupid）原则：优先选择简单直接的实现，避免不必要的复杂度。
2. 遵循 DRY（Don't Repeat Yourself）原则：避免重复逻辑，但不要为了消除少量重复而创建过度抽象。
3. 遵循 SOLID 思想：保持职责清晰、降低模块耦合，提高代码可维护性和扩展能力。

## 架构原则

1. 不要为了保持向后兼容而长期保留废弃方案。优先删除过时代码，而不是增加兼容层、fallback 或临时迁移逻辑。
2. 不要进行未经验证的架构设计。避免提前引入抽象、配置和间接层。
3. 从最小可工作的版本开始，逐步演进系统；每次修改都应该建立在已有可运行系统之上。
4. 永远不要用未来可能需要的复杂性牺牲当前产品的可用性。
5. 对已经确认的后续版本方向，应保留必要且低成本的兼容性扩展点。预留必须有明确的未来使用场景，能够显著降低高成本迁移风险，并且不得引入当前不使用的运行分支、复杂抽象或额外基础设施。

## 代码质量原则

1. 保持模块职责明确，避免一个模块承担过多职责。
2. 优先使用成熟、稳定、维护良好的第三方库，而不是重复造轮子。
3. 使用项目已有依赖解决问题之前，不要随意新增依赖。
4. 在引入新方案前，先检查已有代码、依赖、文档和能力。
5. 避免为了“看起来更优雅”而增加实际复杂度。

## 工程决策原则

1. 优先选择长期可维护的方案，而不是只能临时运行的解决方案。
2. 代码应该服务于业务目标，而不是为了展示技术复杂度。
3. 如果简单方案已经满足需求，不要主动升级为复杂方案。
4. 在数据模型、公开接口或持久化标识以后难以迁移时，优先保留小而明确的兼容字段或模块边界，并在架构文档中记录其当前用途、未来使用者和删除条件。
