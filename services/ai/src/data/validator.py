def validate_training_data(df):
    if df is None or df.empty:
        raise ValueError("Training data is empty")
        
    required_columns = ['recorded_at', 'current_speed']
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")
            
    return True
