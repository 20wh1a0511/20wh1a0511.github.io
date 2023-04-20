import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScalear
import numpy as np
from sklearn import metrics
from sklearn.model_selection import train_test_split 

from sklearn.linear_model import LinearRegression
df = pd.read_csv('walmart_cleaned.csv')
df = df.drop('Unnamed: 0', axis = 1)
df[["Year", "Month", "Week"]] = df["Date"].str.split("-", expand=True, n=2)

aggregate_data = df.groupby(['Store', 'Dept']).Weekly_Sales.agg(['max', 'min', 'mean', 'median', 'std']).reset_index()
store_data = pd.merge(left=df,right=aggregate_data,on=['Store', 'Dept'],how ='left')
store_data.dropna(inplace=True)
df = store_data.copy()
del store_data
df['Date'] = pd.to_datetime(df['Date'])
df.sort_values(by=['Date'],inplace=True)
df.set_index(df.Date, inplace=True)
df['Total_MarkDown'] = df['MarkDown1']+df['MarkDown2']+df['MarkDown3']+df['MarkDown4']+df['MarkDown5']
df.drop(['MarkDown1','MarkDown2','MarkDown3','MarkDown4','MarkDown5'], axis = 1,inplace=True)
numeric_col = ['Weekly_Sales','Size','Temperature','Fuel_Price','CPI','Unemployment','Total_MarkDown']
data_numeric = df[numeric_col].copy()
df = df[(np.abs(stats.zscore(data_numeric)) < 2.5).all(axis = 1)]
df=df[df['Weekly_Sales']>=0] 
df.drop(columns=['Date'],inplace=True)
num_col = ['Weekly_Sales','Size','Temperature','Fuel_Price','CPI','Unemployment','Total_MarkDown','max','min','mean','median','std']
mm_scale = MinMaxScaler(feature_range=(0, 1))
def normalization(df,col):
  for i in col:
    arr = df[i]
    arr = np.array(arr)
    df[i] = mm_scale.fit_transform(arr.reshape(len(arr),1))
  return df
df = normalization(df.copy(),num_col)
X= df.drop(['Weekly_Sales'],axis=1)
Y = df.Weekly_Sales
X_train,X_test,y_train,y_test = train_test_split(X,Y,test_size=0.4, random_state=50)
df['Week'] = df['Week'].astype(int)
df['Month'] = df['Month'].astype(int)
df['Year'] = df['Year'].astype(int)
lRegressor = LinearRegression()
lRegressor.fit(X_train, y_train)
lr_accuracy = lRegressor.score(X_test,y_test)*100
print("Linear Regressor Accuracy : ",lr_accuracy)