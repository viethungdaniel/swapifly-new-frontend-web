import { commonHelpers } from "@/utils/helpers";

import AppTypography from "@/components/AppTypography";
import AppTextField from "@/components/AppTextField";
import AppInputAdornment from "@/components/AppInputAdornment";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppContainer from "@/components/AppContainer";

import HelpCenterSvg from "@@/public/images/svgs/help-desk.svg";
import SearchIcon from "@@/public/images/icons/search.svg";

import useStyles from "./PortalHelpCenterHeader.styles";

import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

const SearchForm = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const navigatedQuery = {
    ...(router.query.platform
      ? {
          platform: router.query.platform,
        }
      : {}),
  };

  const query = router.query as { keyword: string | string[] };

  const searchInputRef = useRef<HTMLInputElement>(null!);

  const controlledKeyword = useMemo<string>(() => {
    return commonHelpers.getOneRouterQueryValue(query.keyword);
  }, [query.keyword]);

  const [keyword, setKeyword] = useState(controlledKeyword);
  const curControlledKeywordRef = useRef(controlledKeyword);

  const { classes } = useStyles();

  const handleSearchFormSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (keyword.length < 1) return;
    searchInputRef.current.blur && searchInputRef.current.blur();
    curControlledKeywordRef.current = keyword;
    router.push({
      pathname: `/help-center/search`,
      query: {
        keyword,
        ...navigatedQuery
      }
    });
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  useEffect(() => {
    if (curControlledKeywordRef.current !== controlledKeyword) {
      curControlledKeywordRef.current = controlledKeyword;
      setKeyword(controlledKeyword);
    }
  }, [controlledKeyword]);

  return (
    <AppTextField
      inputRef={searchInputRef}
      className={classes.searchInput}
      value={keyword}
      bgColor="common.white"
      borderRadius="circular"
      placeholder={t("searchForArticles")}
      required
      endAdornment={
        <AppInputAdornment position="end">
          <AppIconButton
            edge="end"
            color="text.primary"
            borderRadius="circular"
            type="submit"
          >
            <AppSvgIcon component={SearchIcon} fontSize="inherit" />
          </AppIconButton>
        </AppInputAdornment>
      }
      FormControlProps={{
        component: "form",
        onSubmit: handleSearchFormSubmit,
      }}
      onChange={handleKeywordChange}
    />
  );
};

const PortalHelpCenterHeader = () => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <AppContainer>
        <div className={classes.content}>
          <div className={classes.search}>
            <AppTypography variant="headerSemi35" mb={2}>
              {t("portalHelpCenterHeaderTitle")}
            </AppTypography>
            <SearchForm />
          </div>
          <HelpCenterSvg className={classes.helpCenterSvg} />
        </div>
      </AppContainer>
    </div>
  );
};

export default PortalHelpCenterHeader;
