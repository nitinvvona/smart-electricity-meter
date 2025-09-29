import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Set random seed for reproducibility
np.random.seed(42)

# Load the dataset
def load_and_preprocess_data(filepath):
    # Load the dataset
    df = pd.read_csv(filepath)
    
    # Convert timestamp to datetime
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
    
    # Extract time-based features
    df['Hour'] = df['Timestamp'].dt.hour
    df['Day'] = df['Timestamp'].dt.day
    df['Day_of_Week'] = df['Timestamp'].dt.dayofweek
    
    return df

# Analyze patterns and create visualizations
def analyze_patterns(df):
    # Set style
    plt.style.use('seaborn-v0_8')
    
    # Daily total energy consumption pattern
    plt.figure(figsize=(12, 6))
    daily_usage = df.groupby(df['Timestamp'].dt.day)['Total_Energy_kWh'].sum()
    plt.plot(daily_usage.index, daily_usage.values, marker='o')
    plt.title('Daily Total Energy Consumption Pattern')
    plt.xlabel('Day of Month')
    plt.ylabel('Total Energy (kWh)')
    plt.grid(True)
    plt.savefig('daily_energy_pattern.png')
    plt.close()
    
    # Average hourly power usage pattern
    plt.figure(figsize=(12, 6))
    hourly_power = df.groupby('Hour')['Total_Power_W'].mean()
    plt.plot(hourly_power.index, hourly_power.values, marker='o')
    plt.title('Average Hourly Power Usage Pattern')
    plt.xlabel('Hour of Day')
    plt.ylabel('Average Power (W)')
    plt.grid(True)
    plt.savefig('hourly_power_pattern.png')
    plt.close()
    
    # Device-wise energy consumption pie chart
    plt.figure(figsize=(10, 8))
    energy_by_device = {
        'AC Unit': df['AC_Unit_Energy_kWh'].sum(),
        'Fan': df['Fan_Energy_kWh'].sum(),
        'Heater': df['Heater_Energy_kWh'].sum()
    }
    plt.pie(energy_by_device.values(), labels=energy_by_device.keys(), autopct='%1.1f%%')
    plt.title('Device-wise Energy Consumption Distribution')
    plt.savefig('device_energy_distribution.png')
    plt.close()
    
    # Create correlation heatmap
    plt.figure(figsize=(12, 10))
    numeric_cols = ['Total_Power_W', 'AC_Unit_Power_W', 'Fan_Power_W', 'Heater_Power_W', 
                   'Hour', 'Day_of_Week', 'Total_Energy_kWh']
    correlation = df[numeric_cols].corr()
    sns.heatmap(correlation, annot=True, cmap='coolwarm', fmt='.2f')
    plt.title('Correlation Heatmap')
    plt.savefig('correlation_heatmap.png')
    plt.close()
    
    return daily_usage, hourly_power, energy_by_device

# Train machine learning model
def train_model(df):
    # Prepare features and target
    features = ['Hour', 'Day', 'Day_of_Week', 'AC_Unit_Power_W', 'Fan_Power_W', 'Heater_Power_W']
    X = df[features]
    y = df['Total_Power_W']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test_scaled)
    
    # Calculate metrics
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    return model, rmse, r2, feature_importance

# Main analysis
def main():
    # Load and preprocess data
    print("Loading and preprocessing data...")
    df = load_and_preprocess_data('september_2025_power_usage_dataset (1).csv')
    
    # Analyze patterns
    print("\nAnalyzing patterns...")
    daily_usage, hourly_power, energy_by_device = analyze_patterns(df)
    
    # Train model and get results
    print("\nTraining machine learning model...")
    model, rmse, r2, feature_importance = train_model(df)
    
    # Print analysis results
    print("\nAnalysis Results:")
    print("=" * 50)
    print("\nGeneral Statistics:")
    print("-" * 30)
    print(f"Total number of readings: {len(df)}")
    print(f"Time period: {df['Timestamp'].min()} to {df['Timestamp'].max()}")
    
    print("\nPower Usage Statistics:")
    print("-" * 30)
    print(f"Average total power: {df['Total_Power_W'].mean():.2f} W")
    print(f"Maximum total power: {df['Total_Power_W'].max():.2f} W")
    print(f"Minimum total power: {df['Total_Power_W'].min():.2f} W")
    
    print("\nEnergy Consumption by Device:")
    print("-" * 30)
    for device, energy in energy_by_device.items():
        print(f"{device}: {energy:.2f} kWh")
    
    print("\nModel Performance:")
    print("-" * 30)
    print(f"Root Mean Squared Error: {rmse:.2f} W")
    print(f"R-squared Score: {r2:.4f}")
    
    print("\nFeature Importance Ranking:")
    print("-" * 30)
    print(feature_importance)
    
    print("\nVisualizations have been saved as:")
    print("-" * 30)
    print("- daily_energy_pattern.png")
    print("- hourly_power_pattern.png")
    print("- device_energy_distribution.png")
    print("- correlation_heatmap.png")

if __name__ == "__main__":
    main()