import { bindActionCreators } from "redux";
import axios from "axios";

import { storeAdAction } from "@/store";
import { adHelpers, axiosHelpers, reduxHelpers } from "@/utils/helpers";

import SectionBanner from "./components/SectionBanner";
import SectionBrandList from "./components/SectionBrandList";
import SectionRecommendedProductList from "./components/SectionRecommendedProductList";
import SectionProductListCategoryList from "./components/SectionProductListCategoryList";
import SectionAppIntroBanner from "./components/SectionAppIntroBanner";
import AdPopupDialog from "@/views/Home/components/AdPopupDialog";

import HomeContext from "@/views/Home/Home.context";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useIsMounted } from "@/hooks";

import type { CancelTokenSource } from "axios";

const FetchData = () => {
  const { openAdPopupDialog } = useContext(HomeContext);

  const fetchedHomeAdsSourceRef = useRef<CancelTokenSource | null>(null);
  const fetchedProductsSquareAndRectangleAdsSourceRef =
    useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_adAction = useMemo(
    () => bindActionCreators(storeAdAction, dispatch),
    [dispatch]
  );

  const fetchHomeAds = async () => {
    fetchedHomeAdsSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_adAction.fetchAdsSaga,
      {
        params: {
          scopes: ["bannersAds", "popupAd", "recommendedHomeProductsSquareAds"],
        },
        cancelToken: fetchedHomeAdsSourceRef.current.token,
      },
      {
        isReset: true,
      }
    );
    if (!isMounted()) return;
    if (axiosHelpers.checkRequestSuccess(response)) {
      const popupAdExisted = response.data.some((ad: any) =>
        adHelpers.isAdPopupType(ad.type)
      );
      !!popupAdExisted && openAdPopupDialog();
    }
  };

  const fetchProductsSquareAndRectangleAds = async () => {
    fetchedProductsSquareAndRectangleAdsSourceRef.current =
      axios.CancelToken.source();
    $s_adAction.fetchAdsSaga(
      {
        params: {
          scopes: ["productsSquareAds", "productsRectangleAds"],
        },
        cancelToken:
          fetchedProductsSquareAndRectangleAdsSourceRef.current.token,
      },
      {
        isReset: true,
      }
    );
  };

  useEffect(() => {
    fetchProductsSquareAndRectangleAds();

    return () => {
      fetchedProductsSquareAndRectangleAdsSourceRef.current?.cancel &&
        fetchedProductsSquareAndRectangleAdsSourceRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    fetchHomeAds();

    return () => {
      fetchedHomeAdsSourceRef.current?.cancel &&
        fetchedHomeAdsSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return null;
};

const Home = () => {
  const [adPopupDialogOpen, setAdPopupDialogOpen] = useState(false);

  const openAdPopupDialog = () => {
    setAdPopupDialogOpen(true);
  };

  const closeAdPopupDialog = () => {
    setAdPopupDialogOpen(false);
  };

  return (
    <HomeContext.Provider
      value={{
        openAdPopupDialog,
      }}
    >
      <FetchData />
      <AdPopupDialog open={adPopupDialogOpen} onClose={closeAdPopupDialog} />
      <SectionBanner />
      <SectionBrandList />
      <SectionRecommendedProductList />
      <SectionProductListCategoryList />
      <SectionAppIntroBanner />
    </HomeContext.Provider>
  );
};

export default Home;
