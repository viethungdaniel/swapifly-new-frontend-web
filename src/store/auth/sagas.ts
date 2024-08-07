import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { appStorageService, jwtService } from "@/services";
import { authApi } from "@/utils/apis";

import { AuthActionTypes } from "./types";
import {
  checkAuthRequested,
  checkAuthSucceeded,
  fetchRequested,
  fetchSucceeded,
  fetchFailed,
  updateUserLabelSucceeded,
  setUserLoginInfoMediaSocialBinding,
  updateUser,
  bindEmailSucceeded,
  signOutSucceeded,
} from "./action";
import { setAllUserBanner } from "@/store/user/action";

import type {
  FetchScope,
  FetchUserSagaAction,
  SignInSagaAction,
  SignUpSagaAction,
  FetchUserLabelsSagaAction,
  UpdateUserLabelSagaAction,
  SignInWithGoogleSagaAction,
  SignInWithFacebookSagaAction,
  SignInWithGoogleIDTokenSagaAction,
  FetchUserShopSagaAction,
  FetchUserLoginInfoSagaAction,
  BindFacebookSagaAction,
  BindGoogleSagaAction,
  UnbindFacebookSagaAction,
  UnbindGoogleSagaAction,
  UnbindAppleSagaAction,
  UpdateUserMediaSagaAction,
  UpdateUserSagaAction,
  BindPhoneNumberSagaAction,
  UnbindWeChatSagaAction,
  BindEmailSagaAction,
  SignOutSagaAction,
  SignInSucceededAction,
  CheckAuthFailedAction,
} from "./types";
import type { AppState } from "@/store/rootReducer";
import { appBroadcastChannelConstants } from "@/utils/constants";

function* saveTokenOnSignInSucceeded(payload: {
  token: string;
  userId: number;
}) {
  jwtService.saveToken(payload.token);
  appStorageService.saveCookieAuthUserId(payload.userId);
}
function* dispatchSignInSucceededBc(payload: SignInSucceededAction["payload"]) {
  if (typeof window !== undefined) {
    const authExpiredTokenBc = new BroadcastChannel(
      appBroadcastChannelConstants.AUTH_SIGNED_IN_USER_CHANNEL_NAME
    );
    authExpiredTokenBc.postMessage(payload);
  }
}

function* destroyTokenOnCheckAuthFailed() {
  jwtService.destroyToken();
  appStorageService.destroyCookieAuthUserId();
}
function* dispatchCheckAuthFailedBc(payload: CheckAuthFailedAction["payload"]) {
  if (typeof window !== undefined) {
    const authExpiredTokenBc = new BroadcastChannel(
      appBroadcastChannelConstants.AUTH_EXPIRED_TOKEN_CHANNEL_NAME
    );
    authExpiredTokenBc.postMessage(payload);
  }
}

function* signOutSaga(action: SignOutSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve } = action.meta || {};

  try {
    const { data: response }: Awaited<ReturnType<typeof authApi.signOut>> =
      yield call(authApi.signOut, {
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      if (typeof window !== undefined) {
        const authExpiredTokenBc = new BroadcastChannel(
          appBroadcastChannelConstants.AUTH_SIGNED_OUT_USER_CHANNEL_NAME
        );
        authExpiredTokenBc.postMessage(null);
      }
      jwtService.destroyToken();
      yield put(signOutSucceeded());
    }
    resolve && resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    resolve && resolve({ message });
  }
}

function* signOutOnExpiredTokenSaga() {
  jwtService.destroyToken();
  yield put(
    signOutSucceeded({
      reason: "EXPIRED_TOKEN",
    })
  );
}

function* signIn(action: SignInSagaAction) {
  const { params } = action.payload;
  const { resolve } = action.meta || {};

  try {
    const { data: response } = yield call(authApi.signIn, {
      params: params,
    });
    if (axiosHelpers.checkRequestSuccess(response)) {
      const token = response.data.token;
      const { data: _response }: Awaited<ReturnType<typeof authApi.fetchUser>> =
        yield call(authApi.fetchUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (axiosHelpers.checkRequestSuccess(response)) {
        yield call(saveTokenOnSignInSucceeded, {
          token,
          userId: _response.data.id,
        });
        yield call(dispatchSignInSucceededBc, {
          ..._response.data,
          token,
        });
      }
      resolve && resolve(_response);
      return;
    }
    resolve && resolve(response);
  } catch (e) {
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";

    resolve && resolve({ message });
  }
}

function* signInWithGoogleSaga(action: SignInWithGoogleSagaAction) {
  const { params } = action.payload;
  const { resolve } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.signInWithGoogle>> = yield call(
      authApi.signInWithGoogle,
      {
        params: params,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      const token = response.data.token;
      const { data: _response }: Awaited<ReturnType<typeof authApi.fetchUser>> =
        yield call(authApi.fetchUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (axiosHelpers.checkRequestSuccess(response)) {
        yield call(saveTokenOnSignInSucceeded, {
          token,
          userId: _response.data.id,
        });
        yield call(dispatchSignInSucceededBc, {
          ..._response.data,
          token,
        });
      }
      resolve && resolve(_response);
      return;
    }
    resolve && resolve(response);
  } catch (e) {
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve && resolve({ message });
  }
}

function* signInWithGoogleIDTokenSaga(
  action: SignInWithGoogleIDTokenSagaAction
) {
  const { params } = action.payload;
  const { resolve } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.signInWithGoogleIDToken>> = yield call(
      authApi.signInWithGoogleIDToken,
      {
        params: params,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      const token = response.data.token;
      const { data: _response }: Awaited<ReturnType<typeof authApi.fetchUser>> =
        yield call(authApi.fetchUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (axiosHelpers.checkRequestSuccess(response)) {
        yield call(saveTokenOnSignInSucceeded, {
          token,
          userId: _response.data.id,
        });
        yield call(dispatchSignInSucceededBc, {
          ..._response.data,
          token,
        });
      }
      resolve && resolve(_response);
      return;
    }
    resolve && resolve(response);
  } catch (e) {
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve && resolve({ message });
  }
}

function* signInWithFacebookSaga(action: SignInWithFacebookSagaAction) {
  const { params } = action.payload;
  const { resolve } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.signInWithFacebook>> = yield call(
      authApi.signInWithFacebook,
      {
        params: params,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      const token = response.data.token;
      const { data: _response }: Awaited<ReturnType<typeof authApi.fetchUser>> =
        yield call(authApi.fetchUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (axiosHelpers.checkRequestSuccess(response)) {
        yield call(saveTokenOnSignInSucceeded, {
          token,
          userId: _response.data.id,
        });
        yield call(dispatchSignInSucceededBc, {
          ..._response.data,
          token,
        });
        // yield put(signInSucceeded({ ..._response.data, token }));
      }
      resolve && resolve(_response);
      return;
    }
    resolve && resolve(response);
  } catch (e) {
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve && resolve({ message });
  }
}

function* signUpSaga(action: SignUpSagaAction) {
  const { params } = action.payload;
  const { resolve } = action.meta || {};

  try {
    const { data: response } = yield call(authApi.signUp, {
      params: params,
    });
    if (axiosHelpers.checkRequestSuccess(response)) {
      const token = response.data.token;
      const { data: _response }: Awaited<ReturnType<typeof authApi.fetchUser>> =
        yield call(authApi.fetchUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (axiosHelpers.checkRequestSuccess(response)) {
        yield call(saveTokenOnSignInSucceeded, {
          token,
          userId: _response.data.id,
        });
        yield call(dispatchSignInSucceededBc, {
          ..._response.data,
          token,
        });
      }
      resolve && resolve(_response);
    }
    resolve && resolve(response);
  } catch (e) {
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve && resolve({ message });
  }
}

function* checkAuthSaga() {
  const token = jwtService.getToken();

  if (!token) {
    yield put(checkAuthSucceeded(null));
    return;
  }
  yield put(checkAuthRequested());
  try {
    const { data: response } = yield call(authApi.fetchUser);
    if (axiosHelpers.checkRequestSuccess(response)) {
      appStorageService.saveCookieAuthUserId(response?.data?.id!);
      yield put(checkAuthSucceeded(response.data));
    } else {
      yield call(destroyTokenOnCheckAuthFailed);
      yield call(dispatchCheckAuthFailedBc, { message: response.message });
    }
  } catch (error: any) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    const isNetworkError = error?.code === "ERR_NETWORK";
    if (!isNetworkError) {
      yield call(destroyTokenOnCheckAuthFailed);
    }
    yield call(dispatchCheckAuthFailedBc, {
      message,
      isNetworkError,
    });
    // yield put(checkAuthFailed({ message, isNetworkError }));
  }
}

function* fetchUserSaga(action: FetchUserSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "user" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const { data: response }: Awaited<ReturnType<typeof authApi.fetchUser>> =
      yield call(authApi.fetchUser, {
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchUserShopSaga(action: FetchUserShopSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "userShop" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.fetchUserShop>> = yield call(
      authApi.fetchUserShop,
      {
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchUserLoginInfoSaga(action: FetchUserLoginInfoSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "userLoginInfo" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.fetchUserLoginInfo>> = yield call(
      authApi.fetchUserLoginInfo,
      {
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchUserLabelsSaga(action: FetchUserLabelsSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "userLabels" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.fetchUserLabels>> = yield call(
      authApi.fetchUserLabels,
      {
        params: {
          limit: 1000,
        },
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* updateUserLabelsSaga(action: UpdateUserLabelSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.updateUserLabel>> = yield call(
      authApi.updateUserLabel,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(updateUserLabelSucceeded(params.rid));
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* bindFacebookSaga(action: BindFacebookSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const { data: response }: Awaited<ReturnType<typeof authApi.bindFacebook>> =
      yield call(authApi.bindFacebook, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setUserLoginInfoMediaSocialBinding({
          mediaSocial: "facebook",
          value: true,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* bindGoogleSaga(action: BindGoogleSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const { data: response }: Awaited<ReturnType<typeof authApi.bindGoogle>> =
      yield call(authApi.bindGoogle, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setUserLoginInfoMediaSocialBinding({
          mediaSocial: "google",
          value: true,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* bindPhoneNumberSaga(action: BindPhoneNumberSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.bindPhoneNumber>> = yield call(
      authApi.bindPhoneNumber,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        updateUser({
          phone: params.phone,
          country_code: params.country_code,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* bindEmailSaga(action: BindEmailSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const { data: response }: Awaited<ReturnType<typeof authApi.bindEmail>> =
      yield call(authApi.bindEmail, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        bindEmailSucceeded({
          email: params.email,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* unbindFacebookSaga(action: UnbindFacebookSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.unbindFacebook>> = yield call(
      authApi.unbindFacebook,
      {
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setUserLoginInfoMediaSocialBinding({
          mediaSocial: "facebook",
          value: false,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* unbindGoogleSaga(action: UnbindGoogleSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  try {
    const { data: response }: Awaited<ReturnType<typeof authApi.unbindGoogle>> =
      yield call(authApi.unbindGoogle, {
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setUserLoginInfoMediaSocialBinding({
          mediaSocial: "google",
          value: false,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* updateUserSaga(action: UpdateUserSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const { data: response }: Awaited<ReturnType<typeof authApi.updateUser>> =
      yield call(authApi.updateUser, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        updateUser({
          username: response.data.username,
          nickname: response.data.nickname,
          avatar: response.data.avatar,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* updateUserMediaSaga(action: UpdateUserMediaSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof authApi.updateUserMedia>> = yield call(
      authApi.updateUserMedia,
      {
        params: {
          ...params,
          banner_mobile: params.banner,
        },
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      const authUserId: number = yield select(
        (state: AppState) => state.auth.user?.id
      );
      yield all([
        put(
          setAllUserBanner({
            id: authUserId!,
            banner: params.banner!,
          })
        ),
        put(
          updateUser({
            banner: params.banner!,
            banner_mobile: params.banner!,
          })
        ),
      ]);
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* unbindAppleSaga(action: UnbindAppleSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  try {
    const { data: response }: Awaited<ReturnType<typeof authApi.unbindApple>> =
      yield call(authApi.unbindApple, {
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setUserLoginInfoMediaSocialBinding({
          mediaSocial: "apple",
          value: false,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* unbindWeChatSaga(action: UnbindWeChatSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  try {
    const { data: response }: Awaited<ReturnType<typeof authApi.unbindWeChat>> =
      yield call(authApi.unbindWeChat, {
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setUserLoginInfoMediaSocialBinding({
          mediaSocial: "wechat",
          value: false,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* authSaga() {
  yield all([
    takeLatest(
      AuthActionTypes.SIGN_OUT_ON_EXPIRED_TOKEN_SAGA,
      signOutOnExpiredTokenSaga
    ),
    takeLatest(AuthActionTypes.SIGN_OUT_SAGA, signOutSaga),
    takeLatest(AuthActionTypes.SIGN_IN_SAGA, signIn),
    takeLatest(AuthActionTypes.SIGN_IN_WITH_GOOGLE_SAGA, signInWithGoogleSaga),
    takeLatest(
      AuthActionTypes.SIGN_IN_WITH_GOOGLE_ID_TOKEN_SAGA,
      signInWithGoogleIDTokenSaga
    ),
    takeLatest(
      AuthActionTypes.SIGN_IN_WITH_FACEBOOK_SAGA,
      signInWithFacebookSaga
    ),
    takeLatest(AuthActionTypes.SIGN_UP_SAGA, signUpSaga),
    takeLatest(AuthActionTypes.CHECK_AUTH_SAGA, checkAuthSaga),
    takeEvery(AuthActionTypes.FETCH_USER_SAGA, fetchUserSaga),
    takeEvery(AuthActionTypes.FETCH_USER_LABELS_SAGA, fetchUserLabelsSaga),
    takeEvery(AuthActionTypes.FETCH_USER_SHOP_SAGA, fetchUserShopSaga),
    takeLatest(AuthActionTypes.UPDATE_USER_LABELS_SAGA, updateUserLabelsSaga),
    takeLatest(
      AuthActionTypes.FETCH_USER_LOGIN_INFO_SAGA,
      fetchUserLoginInfoSaga
    ),
    takeLatest(AuthActionTypes.BIND_FACEBOOK_SAGA, bindFacebookSaga),
    takeLatest(AuthActionTypes.BIND_GOOGLE_SAGA, bindGoogleSaga),
    takeLatest(AuthActionTypes.BIND_PHONE_NUMBER_SAGA, bindPhoneNumberSaga),
    takeLatest(AuthActionTypes.BIND_EMAIL_SAGA, bindEmailSaga),
    takeLatest(AuthActionTypes.UNBIND_FACEBOOK_SAGA, unbindFacebookSaga),
    takeLatest(AuthActionTypes.UNBIND_GOOGLE_SAGA, unbindGoogleSaga),
    takeLatest(AuthActionTypes.UNBIND_APPLE_SAGA, unbindAppleSaga),
    takeLatest(AuthActionTypes.UNBIND_WECHAT_SAGA, unbindWeChatSaga),
    takeLatest(AuthActionTypes.UPDATE_USER_MEDIA_SAGA, updateUserMediaSaga),
    takeLatest(AuthActionTypes.UPDATE_USER_SAGA, updateUserSaga),
  ]);
}

export default authSaga;
