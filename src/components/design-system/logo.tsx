import * as React from "react";

import { cn } from "@/lib/utils";
import logoHorizontalLight from "@/assets/brand/simulapro_logo_horizontal_light.svg";
import logoHorizontalDark from "@/assets/brand/simulapro_logo_horizontal_dark.svg";
import logoVerticalLight from "@/assets/brand/simulapro_logo_vertical_light.svg";
import logoVerticalDark from "@/assets/brand/simulapro_logo_vertical_dark.svg";
import logoMark from "@/assets/brand/simulapro_mark.svg";

/**
 * Logo oficial da marca SimulaPro — arquivos SVG fornecidos, nunca
 * reconstruídos com texto. `orientation="mark"` usa apenas o cubo (recorte
 * do mesmo artwork vertical, sem o lockup de texto), para contextos
 * pequenos onde não há espaço para a logo completa (ex.: rail de sidebar
 * recolhida). `theme` escolhe a versão com texto branco (fundo escuro) ou
 * texto navy (fundo claro) — a cor do cubo em si é praticamente idêntica
 * nas duas versões.
 */

export type LogoOrientation = "horizontal" | "vertical" | "mark";
export type LogoTheme = "light" | "dark";

const LOGO_SOURCES: Record<"horizontal" | "vertical", Record<LogoTheme, string>> = {
  horizontal: { light: logoHorizontalLight, dark: logoHorizontalDark },
  vertical: { light: logoVerticalLight, dark: logoVerticalDark },
};

export interface LogoProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  orientation?: LogoOrientation;
  theme?: LogoTheme;
}

const Logo = React.forwardRef<HTMLImageElement, LogoProps>(
  (
    { orientation = "horizontal", theme = "light", alt = "SimulaPro", className, ...props },
    ref,
  ) => {
    const src = orientation === "mark" ? logoMark : LOGO_SOURCES[orientation][theme];

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("block h-auto w-auto select-none", className)}
        draggable={false}
        {...props}
      />
    );
  },
);
Logo.displayName = "Logo";

export { Logo };
