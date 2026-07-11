import pandas as pd
import numpy as np

class Preprocessor:
    def preprocess_eta_features(self, df: pd.DataFrame) -> pd.DataFrame:
        if df.empty:
            return df
            
        df_processed = df.copy()
        
        # Ensure timestamp is datetime
        if 'recorded_at' in df_processed.columns:
            df_processed['recorded_at'] = pd.to_datetime(df_processed['recorded_at'])
            
            # Extract features
            df_processed['hour'] = df_processed['recorded_at'].dt.hour
            df_processed['minute'] = df_processed['recorded_at'].dt.minute
            df_processed['time_of_day_float'] = df_processed['hour'] + df_processed['minute'] / 60.0
            df_processed['day_of_week'] = df_processed['recorded_at'].dt.dayofweek
        
        # If running on inference input
        if 'time_of_day' in df_processed.columns and df_processed['time_of_day'].dtype == object:
            def parse_time(t):
                if isinstance(t, str) and ':' in t:
                    h, m = t.split(':')
                    return int(h) + int(m) / 60.0
                return 0.0
            df_processed['time_of_day_float'] = df_processed['time_of_day'].apply(parse_time)
            
        # Select features needed for the model
        expected_cols = ['time_of_day_float', 'day_of_week', 'current_speed', 'stop_distance']
        for col in expected_cols:
            if col not in df_processed.columns:
                df_processed[col] = 0.0  # fallback
                
        return df_processed[expected_cols]

    def extract_labels(self, df: pd.DataFrame) -> pd.Series:
        if 'duration_to_stop' in df.columns:
            return df['duration_to_stop']
        return pd.Series(np.zeros(len(df)))
