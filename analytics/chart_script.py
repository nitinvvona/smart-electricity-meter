import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Load the data
df = pd.read_csv('september_2025_daily_summary.csv')

# Convert Date column to datetime if it's not already
if 'Date' in df.columns:
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
elif df.index.name != 'Date':
    df.index = pd.to_datetime(df.index)

# Create the figure
fig = go.Figure()

# Define colors from the brand palette
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C']

# Add individual device lines
fig.add_trace(go.Scatter(
    x=df.index,
    y=df['AC_Daily_kWh'],
    mode='lines',
    name='AC',
    line=dict(color=colors[0], width=2),
    cliponaxis=False
))

fig.add_trace(go.Scatter(
    x=df.index,
    y=df['Fan_Daily_kWh'],
    mode='lines',
    name='Fan',
    line=dict(color=colors[1], width=2),
    cliponaxis=False
))

fig.add_trace(go.Scatter(
    x=df.index,
    y=df['Heater_Daily_kWh'],
    mode='lines',
    name='Heater',
    line=dict(color=colors[2], width=2),
    cliponaxis=False
))

# Add total consumption as a thicker line
fig.add_trace(go.Scatter(
    x=df.index,
    y=df['Total_Daily_kWh'],
    mode='lines',
    name='Total',
    line=dict(color=colors[3], width=3),
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Daily Energy Consumption - September 2025',
    xaxis_title='Date',
    yaxis_title='Energy (kWh)',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update axes
fig.update_xaxes(showgrid=True)
fig.update_yaxes(showgrid=True)

# Save the chart as both PNG and SVG
fig.write_image('energy_consumption_chart.png')
fig.write_image('energy_consumption_chart.svg', format='svg')

print("Chart saved successfully!")
print(f"Data shape: {df.shape}")
print(f"Date range: {df.index.min()} to {df.index.max()}")