import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "易用",
    Svg: require("../../static/img/easyicon.svg").default,
    description: <>只需要一句简单的命令行就能完成中文的提取和转换</>,
  },
  {
    title: "可配置",
    Svg: require("../../static/img/extensible.svg").default,
    description: (
      <>
        <div>支持 glob 模式匹配文件</div>
      </>
    ),
  },
  {
    title: "全链路",
    Svg: require("../../static/img/comprehensive.svg").default,
    description: <>集成 vscode extension 智能提示</>,
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
