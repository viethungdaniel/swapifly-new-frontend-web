import AppTypography from "@/components/AppTypography";
import Typewriter from "typewriter-effect";

import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";

import type { AppTypographyProps } from "@/components/AppTypography";
import type { Options, TypewriterClass } from "typewriter-effect";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomAppTypewriter = {
  component?: React.ElementType;
  options?: Options;
  onInit?: (typewriter: TypewriterClass) => void;
};

type AppTypewriterProps = Omit<AppTypographyProps, keyof CustomAppTypewriter> &
  CustomAppTypewriter;

interface AppTypewriterTypeMap<P = {}, D extends React.ElementType = "p"> {
  props: P & AppTypewriterProps;
  defaultComponent: D;
}

type AppTypewriterComponent = OverridableComponent<AppTypewriterTypeMap>;

const AppTypewriterContext = createContext<
  Omit<AppTypographyProps, keyof CustomAppTypewriter>
>(null!);

const StyledAppTypography = forwardRef(
  (_: any, ref: React.ForwardedRef<any>) => {
    const { ref: outerRef, ...rest } = useContext(AppTypewriterContext);
    const rootRef = useRef<HTMLDivElement>(null!);

    useImperativeHandle(ref, () => rootRef.current);
    useImperativeHandle(outerRef, () => rootRef.current);

    return <AppTypography ref={rootRef} {...rest} />;
  }
);

const AppTypewriter: AppTypewriterComponent = forwardRef(
  (props: AppTypewriterProps, ref: React.ForwardedRef<any>) => {
    const { options, onInit, ...rest } = props;

    return (
      <AppTypewriterContext.Provider
        value={{
          ...rest,
          ref,
        }}
      >
        <Typewriter
          component={StyledAppTypography}
          options={options}
          onInit={onInit}
        />
      </AppTypewriterContext.Provider>
    );
  }
);

export default AppTypewriter;
