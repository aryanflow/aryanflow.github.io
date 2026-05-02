export const site = {
  name: 'Aryan Kashyap',
  title: 'AI-first software engineer',
  tagline: 'I build systems that stay calm at scale.',
  role: 'Software Developer L2 @ Aptos Retail',
  email: 'work.aryankashyap@gmail.com',
  github: 'https://github.com/aryankashyap7',
  linkedin: 'https://www.linkedin.com/in/aryankashyap/',
  medium: 'https://medium.com/@aryankashyap7',
  resume: '/assets/Aryan Kashyap Resume.pdf',
  about: {
    lede: 'Software Developer & ML Engineer',
    headline: 'Calm systems, sharp edges, zero theatre.',
    paragraphs: [
      `I am a Software Developer L2 at Aptos Retail, rearchitecting high traffic order and product APIs, modernising legacy services, and improving cost and performance across a large AWS microservices estate. Before that, I was a Full Stack Developer at EasyInsights on data heavy SaaS, and a QA Automation Engineer at Schlumberger building test automation you can lean on.`,
      `My work lives where ML, backend engineering, and cloud meet: from ML driven products to API design, observability, and regression frameworks that keep change safe. I studied Computer Science with a specialisation in AIML at VIT Bhopal (CGPA 8.56), with a focus on applied AI.`,
    ],
  },
} as const

export const experience = [
  {
    company: 'Aptos Retail',
    role: 'Software Developer L2',
    place: 'Bengaluru',
    period: 'Nov 2024 to present',
    points: [
      'Rearchitected order and product APIs handling 300K+ monthly requests, with faster client response times.',
      'Optimised AWS infrastructure, saving $400/day through stronger microservice and database design.',
      'Led regression work and a SQL Server to PostgreSQL migration across a large OMS codebase.',
    ],
  },
  {
    company: 'EasyInsights',
    role: 'Full Stack Developer',
    place: 'New Delhi',
    period: 'Mar 2024 to Nov 2024',
    points: [
      'Optimised a marketing analytics SaaS by roughly 75% through ETL and data workflow work.',
      'Integrated REST, GraphQL, and gRPC APIs, plus Shopify, Salesforce, and WordPress for data flows.',
      'Built attribution models and dashboards that helped clients lift campaign ROI and move faster on decisions.',
    ],
  },
  {
    company: 'Schlumberger',
    role: 'QA Automation Engineer',
    place: 'Navi Mumbai',
    period: 'May 2023 to Jun 2023',
    points: [
      'Automated heavy metadata validation, cutting manual work by 78% and improving accuracy.',
      'Added 12+ automated tests in CI/CD for earlier detection in critical paths.',
    ],
  },
] as const

export const education = [
  { title: 'B.Tech · CSE (AIML)', where: 'Vellore Institute of Technology, Bhopal', meta: '2020 to 2024 · CGPA: 8.56' },
  { title: 'Class XII', where: 'DPS Durg, India', meta: '85.2%' },
  { title: 'Class X', where: 'DPS Raigarh, India', meta: 'CGPA: 9.4' },
] as const

export const highlights = [
  "Dean's List (2020 to 2024)",
  'Winner · VIT Tech Fest Hackathon 2023',
  '300+ problems solved on LeetCode & Codeforces',
  'Top 10 · Google Cloud Run Hackathon 2025',
  'AIR 25 · IIT Guwahati Technothlon 2019',
  'AWS Cloud Practitioner',
  'Google Cloud Digital Leader',
] as const

export type ProjectMedia = { type: 'image'; src: string; alt: string } | { type: 'video'; src: string; alt: string }

export type Project = {
  title: string
  subtitle: string
  description: string
  media: ProjectMedia
  featured?: boolean
  badge?: string
  confidential?: boolean
  links?: { href: string; label: 'site' | 'github' }[]
}

export const projects: Project[] = [
  {
    title: 'CareLens 360',
    subtitle: 'Unified health data platform · Google Cloud Run + Gemini',
    description: `A solo build that turns scattered health data into one intelligent timeline: PDFs, wearables, labs, and EHR hooks, with Gemini for trends and anomaly checks. Placed in the top 10 among 300+ teams at Google's Cloud Run hackathon.`,
    media: { type: 'video', src: '/assets/Carelens360.mp4', alt: 'CareLens 360 demo' },
    featured: true,
    badge: 'Top 10 @ Google hackathon',
    links: [{ href: 'https://carelens-360-1097432522480.us-central1.run.app/', label: 'site' }],
  },
  {
    title: 'InfraSage',
    subtitle: 'AI copilot for DevOps · Llama 4 + Qdrant RAG',
    description: `Brings Jira, Confluence, and Bitbucket into one orchestration layer, then does the work: tickets, infra, fault finding. Drove MTTR down 67% across the services I touched.`,
    media: { type: 'image', src: '/assets/infrasage.png', alt: 'InfraSage' },
    confidential: true,
  },
  {
    title: 'Translate AI',
    subtitle: 'Enterprise translation · Hybrid LLM + Amazon Translate',
    description: `Formats from XML to PDF, production pipelines, smart batching (65K+ strings), and back-translation QA. Landed about 92% accuracy with a tight bar on meaning.`,
    media: { type: 'video', src: '/assets/Translateai.mp4', alt: 'Translate AI' },
    confidential: true,
  },
  {
    title: 'Agrisense Smart Harvest',
    subtitle: 'Precision agriculture · CV + TensorFlow',
    description: `Offline first tools for the field: yield and disease models with a dashboard that still works when connectivity does not. Built for real rural constraints.`,
    media: { type: 'image', src: '/assets/KissanAI.jpg', alt: 'Agrisense' },
    links: [{ href: 'https://github.com/aryankashyap7/Kisaan-AI', label: 'github' }],
  },
  {
    title: "CheatSheets for Developers",
    subtitle: "Developer's notebook · Astro + GitHub API",
    description: `Searchable references for 54+ languages and tools. The syntax you only need twice a year, without the 40-tab detour.`,
    media: { type: 'video', src: '/assets/Cheatsheets.mp4', alt: 'Cheatsheets' },
    links: [
      { href: 'https://github.com/aryankashyap7/CheatSheets-for-Developers', label: 'github' },
      { href: 'https://cheats.dhr.wtf/', label: 'site' },
    ],
  },
  {
    title: 'Frontend Maniac',
    subtitle: 'Creative playground · Vanilla web',
    description: `Pure HTML, CSS, and JS experiments: seeing how far the platform goes before you reach for a framework.`,
    media: { type: 'image', src: '/assets/frontend-maniac.png', alt: 'Frontend Maniac' },
    links: [
      { href: 'https://github.com/aryankashyap7/frontend-maniac', label: 'github' },
      { href: 'https://frontendmaniac.netlify.app', label: 'site' },
    ],
  },
  {
    title: 'Facial image classification',
    subtitle: 'SVM + Haar cascade · Flask on AWS',
    description: `Haar for detection, SVM for class labels, and a real API in production. The project that taught me how a model becomes a service.`,
    media: { type: 'image', src: '/assets/FIC.gif', alt: 'FIC demo' },
    links: [{ href: 'https://github.com/aryankashyap7/Facial-Image-Classification', label: 'github' }],
  },
  {
    title: 'Real estate price detector',
    subtitle: 'Scikit-learn + Flask',
    description: `Regression, GridSearchCV, feature work, and a small prediction API. The build where ML engineering finally clicked for me.`,
    media: { type: 'image', src: '/assets/REPP.png', alt: 'REPP' },
    links: [{ href: 'https://github.com/aryankashyap7/Real-Estate-Price-Predictor', label: 'github' }],
  },
]

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@2.16.0/icons'

/** 3 = daily / core production, 2 = regular, 1 = occasional */
export type SkillProficiency = 1 | 2 | 3

export type SkillItem = {
  name: string
  icon: string
  proficiency: SkillProficiency
  /** Shown as native tooltip; keep concise */
  productionHint: string
}

export type SkillGroup = {
  title: string
  /** Single ghost wordmark, aligned to chip column in the UI */
  ghostWord: string
  items: SkillItem[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages & AI/ML',
    ghostWord: 'Languages',
    items: [
      {
        name: 'Python',
        icon: `${DEVICON}/python/python-original.svg`,
        proficiency: 3,
        productionHint: 'Daily: services, jobs, notebooks, and ML glue at Aptos.',
      },
      {
        name: 'TypeScript',
        icon: `${DEVICON}/typescript/typescript-original.svg`,
        proficiency: 3,
        productionHint: 'Daily: frontends and typed Node tooling alongside Python.',
      },
      {
        name: 'TensorFlow',
        icon: `${DEVICON}/tensorflow/tensorflow-original.svg`,
        proficiency: 2,
        productionHint: 'Regular: training and serving paths on past ML products.',
      },
      {
        name: 'Pandas',
        icon: `${DEVICON}/pandas/pandas-original.svg`,
        proficiency: 2,
        productionHint: 'Regular: ETL, exploration, and metrics prep.',
      },
      {
        name: 'Hugging Face',
        icon: 'https://cdn.simpleicons.org/huggingface/FFD21E',
        proficiency: 2,
        productionHint: 'Regular: models, datasets, and experiment packaging.',
      },
      {
        name: 'LangChain',
        icon: 'https://cdn.simpleicons.org/langchain/C2D4FF',
        proficiency: 2,
        productionHint: 'Regular: LLM orchestration and RAG-style flows.',
      },
    ],
  },
  {
    title: 'Frameworks & infrastructure',
    ghostWord: 'Frameworks',
    items: [
      {
        name: 'FastAPI',
        icon: `${DEVICON}/fastapi/fastapi-original.svg`,
        proficiency: 3,
        productionHint: 'Daily: high-traffic APIs and internal services.',
      },
      {
        name: 'React',
        icon: `${DEVICON}/react/react-original.svg`,
        proficiency: 2,
        productionHint: 'Regular: product UIs and internal dashboards.',
      },
      {
        name: 'AWS',
        icon: `${DEVICON}/amazonwebservices/amazonwebservices-original.svg`,
        proficiency: 3,
        productionHint: 'Daily: ECS, Lambda, RDS, and cost-aware microservices.',
      },
      {
        name: 'Docker',
        icon: `${DEVICON}/docker/docker-original.svg`,
        proficiency: 3,
        productionHint: 'Daily: local parity and deployable artifacts.',
      },
      {
        name: 'Kubernetes',
        icon: `${DEVICON}/kubernetes/kubernetes-plain.svg`,
        proficiency: 2,
        productionHint: 'Regular: workloads, rollouts, and cluster hygiene.',
      },
      {
        name: 'PostgreSQL',
        icon: `${DEVICON}/postgresql/postgresql-original.svg`,
        proficiency: 3,
        productionHint: 'Daily: relational data, migrations, and query tuning.',
      },
    ],
  },
  {
    title: 'DevOps & observability',
    ghostWord: 'DevOps',
    items: [
      {
        name: 'Terraform',
        icon: `${DEVICON}/terraform/terraform-original.svg`,
        proficiency: 2,
        productionHint: 'Regular: IaC modules and environment promotion.',
      },
      {
        name: 'Grafana',
        icon: `${DEVICON}/grafana/grafana-original.svg`,
        proficiency: 2,
        productionHint: 'Regular: dashboards during incidents and capacity work.',
      },
      {
        name: 'Prometheus',
        icon: `${DEVICON}/prometheus/prometheus-original.svg`,
        proficiency: 2,
        productionHint: 'Regular: metrics and SLO conversations with teams.',
      },
      {
        name: 'Redis',
        icon: `${DEVICON}/redis/redis-original.svg`,
        proficiency: 3,
        productionHint: 'Daily: caching, queues, and hot-path performance.',
      },
      {
        name: 'Git',
        icon: `${DEVICON}/git/git-original.svg`,
        proficiency: 3,
        productionHint: 'Daily: branching, reviews, and release hygiene.',
      },
      {
        name: 'Tableau',
        icon: 'https://cdn.simpleicons.org/tableau/E97627',
        proficiency: 1,
        productionHint: 'Occasional: stakeholder views on operational data.',
      },
    ],
  },
  {
    title: 'Practices & delivery',
    ghostWord: 'Practices',
    items: [
      {
        name: 'pytest',
        icon: `${DEVICON}/pytest/pytest-original.svg`,
        proficiency: 2,
        productionHint: 'Regular: API and service tests in CI.',
      },
      {
        name: 'GitHub Actions',
        icon: 'https://cdn.simpleicons.org/githubactions/2088FF',
        proficiency: 2,
        productionHint: 'Regular: build, test, and deploy pipelines.',
      },
      {
        name: 'OpenAPI',
        icon: 'https://cdn.simpleicons.org/swagger/85EA2D',
        proficiency: 2,
        productionHint: 'Regular: contract-first APIs, specs, and codegen where it helps.',
      },
      {
        name: 'ESLint',
        icon: `${DEVICON}/eslint/eslint-original.svg`,
        proficiency: 2,
        productionHint: 'Regular: static checks on TS/React codebases.',
      },
      {
        name: 'Playwright',
        icon: 'https://cdn.simpleicons.org/playwright/45ba4b',
        proficiency: 1,
        productionHint: 'Occasional: end-to-end coverage on critical flows.',
      },
    ],
  },
]

/** Flattened skill list for marquee and other aggregate UI */
export const allSkillItems: SkillItem[] = skillGroups.flatMap((g) => g.items)
