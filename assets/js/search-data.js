// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Journal articles and preprints.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Research projects and ongoing work.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-cassyni-talk-lighting-and-circadian-cues",
        
          title: "Cassyni talk: Lighting and circadian cues",
        
        description: "Watch my Cassyni seminar on balance and navigation in larval zebrafish.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/cassyni-lighting-circadian-talk/";
          
        },
      },{id: "news-my-blog-goes-online-today",
          title: 'My blog goes online today! 😄',
          description: "",
          section: "News",},{id: "news-added-function-to-generate-and-update-cv-automatically",
          title: 'Added function to generate and update CV automatically.',
          description: "",
          section: "News",},{id: "news-our-project-a-foundation-model-of-the-superior-colliculus-has-been-selected-for-a-2026-transformative-neuroscience-pilot-grant-from-the-uva-brain-institute-i-am-deeply-grateful-to-my-mentors-zezhou-and-jc-for-their-guidance-and-support",
          title: 'Our project, “A Foundation Model of the Superior Colliculus,” has been selected for...',
          description: "",
          section: "News",},{id: "news-our-paper-lighting-and-circadian-cues-shape-locomotor-strategies-for-balance-and-navigation-in-larval-zebrafish-is-now-published-in-proceedings-of-the-royal-society-b",
          title: 'Our paper, Lighting and circadian cues shape locomotor strategies for balance and navigation...',
          description: "",
          section: "News",},{id: "news-the-recording-of-my-cassyni-talk-on-lighting-circadian-cues-and-zebrafish-locomotion-is-now-available-watch-the-talk",
          title: 'The recording of my Cassyni talk on lighting, circadian cues, and zebrafish locomotion...',
          description: "",
          section: "News",},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6E%74%64%39%6B%7A@%76%69%72%67%69%6E%69%61.%65%64%75", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/liujh22", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/jiahuan-liu-aaa6b7259", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0002-9567-0757", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=IsKJDggAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
