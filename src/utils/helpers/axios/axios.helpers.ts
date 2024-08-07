export const allocateRoute = (status: any) => {
  switch (status) {
    case "": {
    }
  }
};

export const checkRequestSuccess = (response: any) => {
  return !!response?.success;
};

export const checkRequestInvalidToken = (response: any) => {
  return !!response?.success;
};

export const getErrorMessage = (error: any) => {
  return error?.response?.data?.message || error.message;
};
