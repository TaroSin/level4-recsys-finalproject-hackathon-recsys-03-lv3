import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectInfo from "../components/ProjectInfo";
import SingleSelector from "../components/SingleSelector";
import MultiSelector from "../components/MultiSelector";
import SwitchButton from "../components/SwitchButton";
import "../style/SearchPages.css";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/project`;

const SearchProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userType = sessionStorage.getItem("userType");

  const skillList = [
    "Bash/Shell (all shells)",
    "Go",
    "HTML/CSS",
    "Java",
    "JavaScript",
    "Python",
    "TypeScript",
    "Dynamodb",
    "MongoDB",
    "PostgreSQL",
    "Amazon Web Services (AWS)",
    "Heroku",
    "Netlify",
    "Express",
    "Next.js",
    "Node.js",
    "React",
    "Docker",
    "Homebrew",
    "Kubernetes",
    "npm",
    "Vite",
    "Webpack",
    "C#",
    "Firebase Realtime Database",
    "Google Cloud",
    "ASP.NET CORE",
    ".NET (5+) ",
    ".NET Framework (1.0 - 4.8)",
    ".NET MAUI",
    "MSBuild",
    "MySQL",
    "Redis",
    "Digital Ocean",
    "Firebase",
    "Vercel",
    "C",
    "C++",
    "Delphi",
    "PowerShell",
    "SQL",
    "VBA",
    "Visual Basic (.Net)",
    "Microsoft Access",
    "Microsoft SQL Server",
    "SQLite",
    "Cloudflare",
    "ASP.NET",
    "jQuery",
    "RabbitMQ",
    "Xamarin",
    "Yarn",
    "Hetzner",
    "VMware",
    "Ansible",
    "Chocolatey",
    "Make",
    "NuGet",
    "Pacman",
    "Pip",
    "Terraform",
    "Oracle",
    "Blazor",
    "Roslyn",
    "React Native",
    "PHP",
    "Microsoft Azure",
    "MariaDB",
    "Apache Kafka",
    "Godot",
    "Maven (build tool)",
    "F#",
    "Django",
    "WordPress",
    "Pandas",
    "Clojure",
    "Snowflake",
    "Cordova",
    "DirectX",
    "OpenCL",
    "Opencv",
    "Visual Studio Solution",
    "Scala",
    "Presto",
    "Apache Spark",
    "Lua",
    "Nix",
    "AngularJS",
    "Perl",
    "Angular",
    "Flask",
    "Keras",
    "NumPy",
    "Scikit-Learn",
    "TensorFlow",
    "Databricks SQL",
    "DuckDB",
    "Databricks",
    "Elasticsearch",
    "CodeIgniter",
    "NestJS",
    "Cassandra",
    "FastAPI",
    "Ruff",
    "OCaml",
    "H2",
    "Oracle Cloud Infrastructure (OCI)",
    "Spring Boot",
    "Spring Framework",
    "Torch/PyTorch",
    "Gradle",
    "Neo4J",
    "PythonAnywhere",
    "CUDA",
    "Hugging Face Transformers",
    "mlflow",
    "Ruby",
    "Ruby on Rails",
    "Vue.js",
    "pnpm",
    "Fly.io",
    "Render",
    "OpenGL",
    "Rust",
    "Fastify",
    "Tauri",
    "Bun",
    "Assembly",
    "MATLAB",
    "Unity 3D",
    "Unreal Engine",
    "Cosmos DB",
    "Dart",
    "Fortran",
    "Julia",
    "BigQuery",
    "Qt",
    "Ninja",
    "Crystal",
    "R",
    "Tidyverse",
    "Firebird",
    "Clickhouse",
    "Cloud Firestore",
    "Supabase",
    "Solid.js",
    "Electron",
    "Kotlin",
    "Managed Hosting",
    "Laravel",
    "OpenShift",
    "Flutter",
    "Haskell",
    "Hadoop",
    "Ada",
    "Elixir",
    "Erlang",
    "Groovy",
    "Lisp",
    "Zig",
    "InfluxDB",
    "Deno",
    "Htmx",
    "Phoenix",
    "Remix",
    "Svelte",
    "Capacitor",
    "Ionic",
    "Composer",
    "APT",
    "Google Test",
    "Quarkus",
    "Ant",
    "GDScript",
    "Symfony",
    "SwiftUI",
    "IBM DB2",
    "Drupal",
    "OVH",
    "Elm",
    "Gatsby",
    "Nuxt.js",
    "Objective-C",
    "Swift",
    "Strapi",
    "Yii 2",
    "GTK",
    "Podman",
    "Astro",
    "Ktor",
    "Dagger",
    "Prolog",
    "Solr",
    "MFC",
    "Vultr",
    "EventStoreDB",
    "RavenDB",
    "Couch DB",
    "JAX",
    "Cockroachdb",
    "IBM Cloud Or Watson",
    "Pulumi",
    "Couchbase",
    "Cobol",
    "Puppet",
    "Linode, now Akamai",
    "Scaleway",
    "Play Framework",
    "Nim",
    "Apex",
    "OpenStack",
    "Solidity",
    "Colocation",
    "MicroPython",
    "Chef",
    "Alibaba Cloud",
    "Zephyr",
    "TiDB",
    "Datomic",
  ];

  // 필터 상태
  const [showOnlyRecruiting, setShowOnlyRecruiting] = useState(true);
  const [sortOption, setSortOption] = useState("최신순");
  const [categoryFilterOption, setCategoryFilterOption] = useState("직군");
  const [workTypeFilterOption, setWorkTypeFilterOption] = useState("근무 형태");
  const [skillFilterOption, setSkillFilterOption] = useState(skillList);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("인증 토큰이 없습니다. 로그인 후 이용해주세요.");
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
        setError("프로젝트 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const workTypeMapping = { 0: "상주", 1: "원격" };

  // 필터링 로직
  const filteredProjects = projects
    .filter((project) => {
      return (
        (!showOnlyRecruiting || project.status === 0) &&
        (workTypeFilterOption === "근무 형태" ||
          workTypeMapping[project.workType] === workTypeFilterOption) &&
        (categoryFilterOption === "직군" ||
          project.categoryName === categoryFilterOption) &&
        project.skillNameList.some((skill) => skillFilterOption.includes(skill))
      );
    })
    .sort((a, b) => {
      // 정렬 로직
      if (sortOption === "매칭 점수 높은순")
        return b.matchingScore - a.matchingScore;
      if (sortOption === "최신순") return b.projectId - a.projectId;
      if (sortOption === "금액 높은순") return b.budget - a.budget;
      return 0;
    });

  const resetFilters = () => {
    setCategoryFilterOption("직군");
    setWorkTypeFilterOption("근무 형태");
    setSkillFilterOption(skillList);
    setSortOption("최신순");
    setShowOnlyRecruiting(true);
  };

  return (
    <div className="search-project-container">
      <div className="header-container">
        <h3 className="header">프로젝트 리스트</h3>
        <p>총 {filteredProjects.length}개의 프로젝트가 있습니다.</p>
      </div>
      <div className="filters">
        {/* 필터 UI */}
        <div className="filter-group-left">
          <SingleSelector
            options={[
              "직군",
              "소프트웨어/IT",
              "금융",
              "소매/소비자",
              "미디어/광고",
              "제조업",
              "운송/공급망",
              "정부",
              "에너지",
              "헬스케어",
              "교육",
            ]}
            onChange={setCategoryFilterOption}
            value={categoryFilterOption}
          />
          <MultiSelector
            title="스킬"
            options={skillList}
            onChange={setSkillFilterOption}
            value={skillFilterOption}
          />

          {/* 필터 초기화 버튼 */}
          <button className="reset-button" onClick={resetFilters}>
            <i className="bi bi-arrow-counterclockwise"></i> 필터 초기화
          </button>
        </div>
        <div className="filter-group-right">
          <SwitchButton
            text="모집 중인 프로젝트만 표시"
            onChange={setShowOnlyRecruiting}
            value={showOnlyRecruiting}
          />

          <SingleSelector
            options={
              userType === "1"
                ? ["최신순", "금액 높은순"]
                : ["최신순", "매칭 점수 높은순", "금액 높은순"]
            }
            onChange={setSortOption}
            value={sortOption}
          />
        </div>
      </div>

      {/* 필터링된 프로젝트 리스트 */}
      {filteredProjects.map((project) => (
        <ProjectInfo
          key={project.projectId}
          content={{
            projectName: project.projectName,
            skillNameList: project.skillNameList,
            locationName: project.locationName,
            registerDate: project.registerDate,
            duration: project.duration,
            budget: project.budget,
            categoryRole: "개발",
            categoryName: project.categoryName,
            status: project.status,
          }}
        />
      ))}
    </div>
  );
};

export default SearchProjectPage;
