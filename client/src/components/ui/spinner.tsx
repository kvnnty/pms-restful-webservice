import React from "react";
import styles from "@/styles/modules/spinner.module.css";

interface SpinnerProps {
  color?: string;
  size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ color = "white", size = 20 }) => {
  const spinnerStyle: React.CSSProperties = {
    "--spinner-color": color,
    "--spinner-size": `${size}px`,
  } as React.CSSProperties;

  return <div className={styles.loader} style={spinnerStyle}></div>;
};

export default Spinner;
