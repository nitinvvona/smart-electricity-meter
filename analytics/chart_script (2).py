import plotly.express as px
import plotly.graph_objects as go

# Data from the provided JSON
devices = ["AC Unit", "Fan", "Heater"]
energy_kwh = [7.53, 4.55, 0.93]
percentage = [57.9, 35.0, 7.2]

# Create labels that include both kWh and percentage (keeping under 15 char limit per strict instructions)
labels = [f"{device}<br>{kwh}kWh ({pct}%)" for device, kwh, pct in zip(devices, energy_kwh, percentage)]

# Create custom colors based on user specifications
colors = ['#1FB8CD', '#2E8B57', '#DB4545']  # Blue-ish, Green, Red

# Create pie chart
fig = go.Figure(data=[go.Pie(
    labels=devices,
    values=energy_kwh,
    text=[f"{kwh}kWh<br>{pct}%" for kwh, pct in zip(energy_kwh, percentage)],
    textinfo='text',
    marker=dict(colors=colors),
    hovertemplate='<b>%{label}</b><br>Energy: %{value} kWh<br>Percentage: %{percent}<extra></extra>'
)])

# Update layout with title and legend
fig.update_layout(
    title="Device Energy Sep 2025",
    uniformtext_minsize=14, 
    uniformtext_mode='hide'
)

# Save as both PNG and SVG
fig.write_image("energy_pie_chart.png")
fig.write_image("energy_pie_chart.svg", format="svg")

fig.show()