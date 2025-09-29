import pandas as pd
import plotly.graph_objects as go

# Load the data
df = pd.read_csv("september_2025_hourly_patterns.csv")

# Create the figure
fig = go.Figure()

# Define colors from the brand palette
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F']
line_styles = ['solid', 'dash', 'dot', 'dashdot']

# Add traces for each power consumption type
devices = ['AC_Unit_Power_W', 'Fan_Power_W', 'Heater_Power_W', 'Total_Power_W']
device_labels = ['AC Unit', 'Fan', 'Heater', 'Total']

for i, (device, label) in enumerate(zip(devices, device_labels)):
    fig.add_trace(go.Scatter(
        x=df['Hour'],
        y=df[device],
        mode='lines',
        name=label,
        line=dict(color=colors[i], dash=line_styles[i], width=2),
        hovertemplate='%{fullData.name}<br>Hour: %{x}<br>Power: %{y}W<extra></extra>'
    ))

# Update layout
fig.update_layout(
    title="Hourly Power Consumption - Sept 2025",
    xaxis_title="Hour",
    yaxis_title="Power (W)",
    showlegend=True,
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    xaxis=dict(showgrid=True, gridwidth=1, gridcolor='lightgray'),
    yaxis=dict(showgrid=True, gridwidth=1, gridcolor='lightgray')
)

# Update x-axis to show all hours
fig.update_xaxes(tickmode='linear', tick0=0, dtick=2)

# Update traces
fig.update_traces(cliponaxis=False)

# Save the chart as both PNG and SVG
fig.write_image("power_consumption_chart.png")
fig.write_image("power_consumption_chart.svg", format="svg")

fig.show()