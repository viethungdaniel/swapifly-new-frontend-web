import { forwardRef, useState } from "react";

import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";

import VisibilityIcon from "@@/public/images/icons/visibility.svg";
import VisibilityOffIcon from "@@/public/images/icons/visibility-off.svg";

import type { AppTextFieldProps } from "@/components/AppTextField";

type PasswordVisibilityToggleTextFieldProps = Omit<
  AppTextFieldProps,
  "endAdornment" | "type"
>;

const PasswordVisibilityToggleTextField = forwardRef(
  (
    props: PasswordVisibilityToggleTextFieldProps,
    ref: React.ForwardedRef<any>
  ) => {
    const [show, setShow] = useState(false);

    const handleShowToggle = () => {
      setShow(!show);
    };

    return (
      <AppTextField
        {...props}
        ref={ref}
        type={show ? "text" : "password"}
        endAdornment={
          <AppInputAdornment position="end">
            <AppIconButton
              borderRadius={props.borderRadius}
              edge="x"
              color="text.primary"
              onClick={handleShowToggle}
            >
              <AppSvgIcon
                component={show ? VisibilityIcon : VisibilityOffIcon}
                fontSize="inherit"
              />
            </AppIconButton>
          </AppInputAdornment>
        }
      />
    );
  }
);

export default PasswordVisibilityToggleTextField;
