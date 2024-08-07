import { createSelector } from "@reduxjs/toolkit";
import { selectInboxThreadsAds } from "@/store/ad/selectors";

import type { AppState } from "@/store";

export const selectAuthUser = (state: AppState) => state.auth.user;

export const selectInboxThreadOffer = (state: AppState) =>
  state.inbox.inboxThreadOffer;

export const selectInboxThreads = (state: AppState) => state.inbox.inboxThreads;

export const selectSelectedInboxThreadType = (state: AppState) =>
  state.inbox.selectedInboxThreadType;

export const selectAdWithInboxThreads = createSelector(
  [selectInboxThreads, selectInboxThreadsAds],
  (inboxThreads, inboxThreadsAds) => {
    const adWithInboxThreads: {
      inboxThreadsAd: (typeof inboxThreadsAds)[number] | null;
      inboxThread: (typeof inboxThreads)[number] | null;
    }[] = inboxThreads.map((inboxThread) => {
      return {
        inboxThreadsAd: null,
        inboxThread,
      };
    });

    if (adWithInboxThreads.length > 0)
      inboxThreadsAds.forEach((inboxThreadsAd) => {
        const productsRectangleAdIndex = inboxThreadsAd?.ep_rectangle
          ? inboxThreadsAd?.ep_rectangle - 1
          : 0;
        adWithInboxThreads.splice(productsRectangleAdIndex, 0, {
          inboxThread: null,
          inboxThreadsAd,
        });
      });
    return adWithInboxThreads;
  }
);

export const selectInboxThreadOfferUser = createSelector(
  [selectInboxThreadOffer, selectAuthUser],
  (inboxThreadOffer, authUser) => {
    if (!inboxThreadOffer) return null;
    if (inboxThreadOffer?.seller_id === authUser?.id) {
      return {
        id: inboxThreadOffer.buyer_id,
        avatar: inboxThreadOffer.buyer_avatar,
        nickname: inboxThreadOffer.buyer_nickname,
        username: inboxThreadOffer.buyer_username,
        is_reviewed: inboxThreadOffer.s_review,
        is_buyer: true,
        is_seller: false,
      };
    }
    return {
      id: inboxThreadOffer.seller_id,
      avatar: inboxThreadOffer.seller_avatar,
      nickname: inboxThreadOffer.seller_nickname,
      username: inboxThreadOffer.seller_username,
      is_reviewed: inboxThreadOffer.b_review,
      is_buyer: false,
      is_seller: true,
    };
  }
);

export const selectInboxThreadOfferAuthUser = createSelector(
  [selectInboxThreadOffer, selectAuthUser],
  (inboxThreadOffer, authUser) => {
    if (!inboxThreadOffer) return null;
    if (inboxThreadOffer?.seller_id === authUser?.id) {
      return {
        id: inboxThreadOffer.seller_id,
        avatar: inboxThreadOffer.seller_avatar,
        nickname: inboxThreadOffer.seller_nickname,
        username: inboxThreadOffer.seller_username,
        is_reviewed: inboxThreadOffer.b_review,
        is_buyer: false,
        is_seller: true,
      };
    }
    return {
      id: inboxThreadOffer.buyer_id,
      avatar: inboxThreadOffer.buyer_avatar,
      nickname: inboxThreadOffer.buyer_nickname,
      username: inboxThreadOffer.buyer_username,
      is_reviewed: inboxThreadOffer.s_review,
      is_buyer: true,
      is_seller: false,
    };
  }
);

export const selectInboxThreadSeller = createSelector(
  [selectInboxThreadOffer],
  (inboxThreadOffer) => {
    if (!inboxThreadOffer) return null;
    return {
      id: inboxThreadOffer.seller_id,
      avatar: inboxThreadOffer.seller_avatar,
      nickname: inboxThreadOffer.seller_nickname,
      username: inboxThreadOffer.seller_username,
    };
  }
);

export const selectInboxThreadBuyer = createSelector(
  [selectInboxThreadOffer],
  (inboxThreadOffer) => {
    if (!inboxThreadOffer) return null;
    return {
      id: inboxThreadOffer.buyer_id,
      avatar: inboxThreadOffer.buyer_avatar,
      nickname: inboxThreadOffer.buyer_nickname,
      username: inboxThreadOffer.buyer_username,
    };
  }
);

export const selectInboxThreadOfferUserLatestOnlineTime = createSelector(
  [selectInboxThreadOffer, selectAuthUser],
  (inboxThreadOffer, authUser) => {
    if (!inboxThreadOffer) return 0;
    if (inboxThreadOffer?.seller_id === authUser?.id)
      return inboxThreadOffer.buyer_last_online_time ?? 0;
    return inboxThreadOffer.seller_last_online_time ?? 0;
  }
);

export const selectIsInboxThreadOfferAuthSeller = createSelector(
  [selectInboxThreadOffer, selectAuthUser],
  (inboxThreadOffer, authUser) => {
    return inboxThreadOffer?.seller_id === authUser?.id;
  }
);

export const selectInboxThreadAuthBlocked = createSelector(
  [selectInboxThreadOffer, selectAuthUser],
  (inboxThreadOffer, authUser) => {
    if (inboxThreadOffer?.seller_id === authUser?.id) {
      return !!inboxThreadOffer?.b_block;
    }
    return !!inboxThreadOffer?.s_block;
  }
);

export const selectInboxThreadAuthArchived = createSelector(
  [selectInboxThreadOffer, selectAuthUser],
  (inboxThreadOffer, authUser) => {
    if (inboxThreadOffer?.seller_id === authUser?.id) {
      return !!inboxThreadOffer?.s_archive;
    }
    return !!inboxThreadOffer?.b_archive;
  }
);

export const selectInboxThreadUserBlocked = createSelector(
  [selectInboxThreadOffer, selectAuthUser],
  (inboxThreadOffer, authUser) => {
    if (inboxThreadOffer?.seller_id === authUser?.id) {
      return !!inboxThreadOffer?.s_block;
    }
    return !!inboxThreadOffer?.b_block;
  }
);

export const selectInboxThreadOfferReviewed = createSelector(
  [selectInboxThreadOffer, selectAuthUser],
  (inboxThreadOffer, authUser) => {
    if (!inboxThreadOffer) return false;
    if (inboxThreadOffer?.seller_id === authUser?.id)
      return !!inboxThreadOffer.s_review;
    return !!inboxThreadOffer.b_review;
  }
);

export const selectInboxThreadOfferProduct = createSelector(
  [selectInboxThreadOffer],
  (inboxThreadOffer) => {
    if (!inboxThreadOffer) return null;
    return {
      id: inboxThreadOffer.product_id,
      name: inboxThreadOffer.product_name,
      image: inboxThreadOffer.product_image,
      price_origin: inboxThreadOffer.product_price_origin,
      currency: inboxThreadOffer.product_currency_origin,
      state: inboxThreadOffer.product_state,
    };
  }
);

export const selectInboxThreadOfferStateItem = createSelector(
  [selectInboxThreadOffer],
  (inboxThreadOffer) => {
    if (!inboxThreadOffer) return null;
    return {
      price_origin: inboxThreadOffer.offer_price_origin,
      currency: inboxThreadOffer.offer_currency_origin,
      status: inboxThreadOffer.offer_status,
    };
  }
);
