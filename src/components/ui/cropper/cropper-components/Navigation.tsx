import React, { FC } from "react";
import cn from "classnames";
import "./Navigation.scss";

interface Props {
  onRotate?: (angle: number) => void;
  onFlip?: (horizontal: boolean, vertical: boolean) => void;
  onReset?: () => void;
  changed?: boolean;
  className?: string;
  disabled?: unknown;
}

export const Navigation: FC<Props> = ({
  className,
  disabled,
  changed,
  onReset,
  onRotate,
  onFlip,
}) => {
  const rotateLeft = () => {
    if (onRotate && !disabled) {
      onRotate(-90);
    }
  };

  const rotateRight = () => {
    if (onRotate && !disabled) {
      onRotate(90);
    }
  };

  const flipHorizontal = () => {
    if (onFlip && !disabled) {
      onFlip(true, false);
    }
  };

  const flipVertical = () => {
    if (onFlip && !disabled) {
      onFlip(false, true);
    }
  };

  return (
    <div className={cn("default-cropper-navigation", className)}>
      <button
        className="default-cropper-navigation__button"
        onClick={flipHorizontal}
      >
        flipHorizontal
      </button>
      <button
        className="default-cropper-navigation__button"
        onClick={rotateRight}
      >
        rotateRight
      </button>
      <div className="default-cropper-navigation__delimiter">
        <div
          className={cn(
            "default-cropper-navigation__dot",
            changed && "default-cropper-navigation__dot--hidden",
          )}
        />
        <button
          className={cn(
            "default-cropper-navigation__reset-button",
            !changed && "default-cropper-navigation__reset-button--hidden",
          )}
          onClick={onReset}
        >
          resetIcon
        </button>
      </div>
      <button
        className="default-cropper-navigation__button"
        onClick={rotateLeft}
      >
        rotateLeft
      </button>
      <button
        className="default-cropper-navigation__button"
        onClick={flipVertical}
      >
        flipVertical
      </button>
    </div>
  );
};
