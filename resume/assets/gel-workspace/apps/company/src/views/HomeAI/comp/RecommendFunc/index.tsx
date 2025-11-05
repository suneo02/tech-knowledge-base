import { DownO, UpO } from "@wind/icons";
import { Button } from "@wind/wind-ui";
import React, { useState } from "react";
import { useHomeEntryList } from "./config/domestic";
import { SearchHomeItemData } from "./config/type";
import styles from "./index.module.less";

/**
 * RecommendFunc component displays recommended functions in a grid layout
 * with expand/collapse functionality. Initially shows 10 items, 5 per row.
 */
export const HomeRecommendFunc: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const functions = useHomeEntryList();
  const itemsToShow = isExpanded ? functions : functions.slice(0, 10);
  const showExpandButton = functions.length > 10;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (item: SearchHomeItemData) => {
    if (item.url) {
      window.open(item.url);
    }
  };

  return (
    <div className={styles.recommendFunc}>
      <div className={styles.recommendFuncTitle}>
        <span>推荐功能</span>
      </div>
      <div className={styles.functionGrid}>
        {itemsToShow.map((func) => (
          <div key={func.key} className={styles.gridItem}>
            <div
              className={`${styles.functionItem}`}
              onClick={() => handleItemClick(func)}
            >
              <div className={styles.title}>{func.title}</div>
              <div className={styles.desc}>{func.desc}</div>
              <div
                className={styles.iconBg}
                dangerouslySetInnerHTML={{ __html: func.fIcon }}
              ></div>
              {func.hot && (
                <div className={styles.hotTag}>
                  <span>HOT</span>
                </div>
              )}
              {func.new && (
                <div className={styles.newTag}>
                  <span>NEW</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showExpandButton && (
        <div className={styles.expandButtonWrapper}>
          <Button
            className={styles.expandButton}
            type="link"
            onClick={toggleExpand}
          >
            {isExpanded ? "收起" : "展开更多"}
            {isExpanded ? (
              <UpO
                className={styles.buttonIcon}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ) : (
              <DownO
                className={styles.buttonIcon}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
