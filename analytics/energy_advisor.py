import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from datetime import datetime

class EnergyAdvisor:
    def __init__(self, data_file):
        self.df = pd.read_csv(data_file)
        self.df['Timestamp'] = pd.to_datetime(self.df['Timestamp'])
        self.df['Hour'] = self.df['Timestamp'].dt.hour
        self.df['Day'] = self.df['Timestamp'].dt.day
        self.df['Day_of_Week'] = self.df['Timestamp'].dt.dayofweek
        
    def analyze_peak_hours(self):
        """Analyze and identify peak consumption hours"""
        hourly_usage = self.df.groupby('Hour')['Total_Power_W'].mean()
        peak_hours = hourly_usage[hourly_usage > hourly_usage.mean() + hourly_usage.std()]
        return peak_hours
    
    def analyze_device_patterns(self):
        """Analyze device usage patterns and inefficiencies"""
        device_patterns = {
            'AC_Unit': {
                'total_energy': self.df['AC_Unit_Energy_kWh'].sum(),
                'avg_power': self.df['AC_Unit_Power_W'].mean(),
                'peak_power': self.df['AC_Unit_Power_W'].max(),
                'usage_hours': len(self.df[self.df['AC_Unit_Power_W'] > 0]),
                'simultaneous_usage': len(self.df[(self.df['AC_Unit_Power_W'] > 0) & 
                                                (self.df['Heater_Power_W'] > 0)]),
                'continuous_usage': self.get_continuous_usage('AC_Unit_Power_W', 6),  # 6 hours threshold
                'peak_hour_usage': self.get_peak_hour_usage('AC_Unit_Power_W')
            },
            'Fan': {
                'total_energy': self.df['Fan_Energy_kWh'].sum(),
                'avg_power': self.df['Fan_Power_W'].mean(),
                'peak_power': self.df['Fan_Power_W'].max(),
                'usage_hours': len(self.df[self.df['Fan_Power_W'] > 0])
            },
            'Heater': {
                'total_energy': self.df['Heater_Energy_kWh'].sum(),
                'avg_power': self.df['Heater_Power_W'].mean(),
                'peak_power': self.df['Heater_Power_W'].max(),
                'usage_hours': len(self.df[self.df['Heater_Power_W'] > 0])
            }
        }
        return device_patterns
    
    def get_continuous_usage(self, column, hours_threshold):
        """Identify periods of continuous usage exceeding threshold"""
        continuous_periods = []
        current_period = []
        
        for idx, row in self.df.iterrows():
            if row[column] > 0:
                if not current_period:
                    current_period = [row['Timestamp']]
                else:
                    current_period.append(row['Timestamp'])
            else:
                if current_period:
                    if len(current_period) >= hours_threshold:
                        continuous_periods.append({
                            'start': current_period[0],
                            'end': current_period[-1],
                            'duration': len(current_period)
                        })
                    current_period = []
        
        return continuous_periods

    def get_peak_hour_usage(self, column):
        """Analyze usage during peak hours"""
        peak_hours = [11, 12, 13, 14, 15]  # 11 AM to 3 PM
        peak_usage = self.df[
            (self.df['Hour'].isin(peak_hours)) &
            (self.df[column] > 0)
        ]
        return len(peak_usage)

    def identify_wastage_patterns(self):
        """Identify potential energy wastage patterns"""
        wastage_patterns = []
        
        # Check for simultaneous AC and Heater usage
        simultaneous = self.df[(self.df['AC_Unit_Power_W'] > 0) & (self.df['Heater_Power_W'] > 0)]
        if len(simultaneous) > 0:
            wastage_patterns.append({
                'issue': 'Simultaneous AC and Heater Usage',
                'occurrences': len(simultaneous),
                'wasted_energy': (simultaneous['AC_Unit_Energy_kWh'] + 
                                simultaneous['Heater_Energy_kWh']).sum(),
                'timestamps': simultaneous['Timestamp'].tolist()
            })
        
        # Check for peak hour usage
        peak_hours = self.analyze_peak_hours()
        peak_usage = self.df[self.df['Hour'].isin(peak_hours.index)]
        if len(peak_usage) > 0:
            wastage_patterns.append({
                'issue': 'High Usage During Peak Hours',
                'occurrences': len(peak_usage),
                'total_energy': peak_usage['Total_Energy_kWh'].sum(),
                'hours': peak_hours.index.tolist()
            })
        
        # Check for standby power consumption
        standby_threshold = 50  # watts
        standby_usage = self.df[(self.df['Total_Power_W'] > 0) & 
                               (self.df['Total_Power_W'] < standby_threshold)]
        if len(standby_usage) > 0:
            wastage_patterns.append({
                'issue': 'Standby Power Consumption',
                'occurrences': len(standby_usage),
                'wasted_energy': standby_usage['Total_Energy_kWh'].sum(),
                'avg_standby_power': standby_usage['Total_Power_W'].mean()
            })
            
        return wastage_patterns
    
    def generate_recommendations(self):
        """Generate energy-saving recommendations based on analysis"""
        recommendations = []
        device_patterns = self.analyze_device_patterns()
        wastage_patterns = self.identify_wastage_patterns()
        peak_hours = self.analyze_peak_hours()
        
        # 1. Critical recommendations - Device conflicts and immediate actions
        if device_patterns['AC_Unit']['simultaneous_usage'] > 0:
            recommendations.append({
                'category': 'Critical',
                'device': 'AC and Heater',
                'issue': 'Simultaneous Usage',
                'recommendation': [
                    'Avoid using AC and heater simultaneously',
                    'Use temperature sensors to automate device switching',
                    'Consider using a programmable thermostat to prevent overlapping operation'
                ],
                'potential_savings': f"{device_patterns['AC_Unit']['simultaneous_usage'] * 0.5:.2f} kWh per occurrence"
            })
        
        # 2. Peak hour usage recommendations
        if len(peak_hours) > 0:
            recommendations.append({
                'category': 'High Priority',
                'device': 'All Devices',
                'issue': 'Peak Hour Usage',
                'recommendation': [
                    f'Shift non-essential device usage away from peak hours ({", ".join(map(str, peak_hours.index))})',
                    'Use timer switches to automatically control device operation during peak hours',
                    'Consider installing a smart power strip that can be programmed to turn off during peak hours',
                    'Pre-cool spaces before peak hours in summer',
                    'Use natural ventilation during early morning and evening hours'
                ],
                'potential_savings': '10-15% on energy bills'
            })
        
        # 3. AC usage optimization
        ac_usage = device_patterns['AC_Unit']
        if ac_usage['total_energy'] > 200:  # High AC usage threshold
            recommendations.append({
                'category': 'High Priority',
                'device': 'AC Unit',
                'issue': 'High Energy Consumption',
                'recommendation': [
                    'Set AC temperature 1-2 degrees higher and use fans for air circulation',
                    'Clean or replace AC filters monthly',
                    'Use window coverings to reduce solar heat gain',
                    'Ensure proper insulation around windows and doors',
                    'Consider using a ceiling fan to improve air circulation',
                    'Schedule regular AC maintenance to maintain efficiency'
                ],
                'potential_savings': '5-10% on AC energy consumption'
            })
        
        # 4. Fan usage optimization
        fan_usage = device_patterns['Fan']
        if fan_usage['usage_hours'] > 300:  # High fan usage threshold
            recommendations.append({
                'category': 'Medium Priority',
                'device': 'Fan',
                'issue': 'Extended Usage',
                'recommendation': [
                    'Use fans only in occupied rooms',
                    'Consider installing motion sensors for automatic control',
                    'Clean fan blades regularly for optimal performance',
                    'Use lower speed settings when possible',
                    'Adjust fan direction seasonally (counter-clockwise in summer, clockwise in winter)'
                ],
                'potential_savings': '2-5% on fan energy consumption'
            })
        
        # 5. Standby power recommendations
        for pattern in wastage_patterns:
            if pattern['issue'] == 'Standby Power Consumption':
                recommendations.append({
                    'category': 'Medium Priority',
                    'device': 'All Devices',
                    'issue': 'Standby Power Waste',
                    'recommendation': [
                        'Use smart power strips to completely turn off devices when not in use',
                        'Identify and unplug devices with high standby power consumption',
                        'Consider replacing old devices with energy-efficient models',
                        'Group devices on separate power strips based on usage patterns',
                        'Enable power-saving modes on all electronic devices'
                    ],
                    'potential_savings': f"{pattern['wasted_energy']:.2f} kWh per month"
                })
        
        # Additional critical recommendations
        if device_patterns['AC_Unit']['continuous_usage']:
            recommendations.append({
                'category': 'Critical',
                'device': 'AC Unit',
                'issue': 'Extended Continuous Operation',
                'recommendation': [
                    'Avoid running AC continuously for more than 6 hours',
                    'Use programmable thermostat to cycle AC operation',
                    'Implement temperature-based automatic shutoff',
                    'Consider using sleep mode settings during night hours'
                ],
                'potential_savings': '10-15% on AC energy consumption'
            })
            
        # Additional peak usage recommendations
        recommendations.append({
            'category': 'Critical',
            'device': 'Power Management',
            'issue': 'High Peak Load',
            'recommendation': [
                'Stagger the operation of major appliances',
                'Install a power monitoring display to track real-time usage',
                'Set up automated power management schedules',
                'Use smart plugs to control device operation remotely'
            ],
            'potential_savings': '8-12% on peak hour consumption'
        })

        # 6. General energy-saving recommendations
        recommendations.append({
            'category': 'General',
            'device': 'All Devices',
            'issue': 'Overall Energy Efficiency',
            'recommendation': [
                'Conduct regular energy audits to identify inefficiencies',
                'Consider installing a home energy monitoring system',
                'Educate all household members about energy-saving practices',
                'Schedule regular maintenance for all major appliances',
                'Use natural light when possible during daytime',
                'Adjust device settings based on seasonal changes',
                'Consider upgrading to smart home devices for better control'
            ],
            'potential_savings': '15-20% on overall energy consumption'
        })

        # Additional general recommendations
        recommendations.append({
            'category': 'General',
            'device': 'Lighting and Electronics',
            'issue': 'Inefficient Usage',
            'recommendation': [
                'Replace all bulbs with LED alternatives',
                'Install motion sensors for automatic light control',
                'Use task lighting instead of whole room lighting',
                'Configure power management settings on all electronics'
            ],
            'potential_savings': '5-8% on lighting and electronics'
        })

        recommendations.append({
            'category': 'General',
            'device': 'Home Environment',
            'issue': 'Thermal Efficiency',
            'recommendation': [
                'Seal air leaks around windows and doors',
                'Add or upgrade insulation in walls and ceiling',
                'Install thermal curtains or window films',
                'Create shade with trees or exterior shading devices'
            ],
            'potential_savings': '10-15% on heating/cooling costs'
        })
        
        # 7. Behavioral recommendations
        recommendations.append({
            'category': 'Behavioral',
            'device': 'User Habits',
            'issue': 'Energy-Conscious Behavior',
            'recommendation': [
                'Create a schedule for device usage based on daily routines',
                'Set reminders to turn off devices when not in use',
                'Track and review energy consumption weekly',
                'Adjust device usage based on weather conditions',
                'Develop energy-saving habits through regular practice'
            ],
            'potential_savings': '5-10% through behavioral changes'
        })

        # Additional behavioral recommendations
        recommendations.append({
            'category': 'Behavioral',
            'device': 'Daily Routines',
            'issue': 'Inefficient Daily Practices',
            'recommendation': [
                'Run energy-intensive appliances during off-peak hours',
                'Open windows for natural cooling when weather permits',
                'Use natural light during daytime hours',
                'Adjust thermostat before leaving home or sleeping'
            ],
            'potential_savings': '3-7% through routine optimization'
        })

        recommendations.append({
            'category': 'Behavioral',
            'device': 'Maintenance Habits',
            'issue': 'Poor Maintenance Practices',
            'recommendation': [
                'Clean or replace AC filters monthly',
                'Regular cleaning of fan blades and vents',
                'Check and clean refrigerator coils quarterly',
                'Inspect and clean dryer vents regularly'
            ],
            'potential_savings': '4-8% through better maintenance'
        })
        
        return recommendations

    def plot_daily_patterns(self):
        """Plot daily energy consumption patterns"""
        plt.figure(figsize=(12, 6))
        daily_usage = self.df.groupby('Day')['Total_Energy_kWh'].sum()
        plt.plot(daily_usage.index, daily_usage.values, marker='o')
        plt.title('Daily Energy Consumption Pattern')
        plt.xlabel('Day of Month')
        plt.ylabel('Total Energy (kWh)')
        plt.grid(True)
        plt.savefig('daily_consumption_pattern.png')
        plt.close()
        
        return daily_usage

def main():
    # Initialize the advisor
    advisor = EnergyAdvisor('september_2025_power_usage_dataset (1).csv')
    
    # Generate recommendations
    recommendations = advisor.generate_recommendations()
    
    # Analyze patterns
    device_patterns = advisor.analyze_device_patterns()
    wastage_patterns = advisor.identify_wastage_patterns()
    daily_usage = advisor.plot_daily_patterns()
    
    # Print analysis results
    print("\nEnergy Usage Analysis and Recommendations")
    print("=" * 50)
    
    print("\nDevice Usage Summary:")
    print("-" * 30)
    for device, stats in device_patterns.items():
        print(f"\n{device}:")
        print(f"Total Energy: {stats['total_energy']:.2f} kWh")
        print(f"Average Power: {stats['avg_power']:.2f} W")
        print(f"Usage Hours: {stats['usage_hours']}")
    
    print("\nIdentified Wastage Patterns:")
    print("-" * 30)
    for pattern in wastage_patterns:
        print(f"\nIssue: {pattern['issue']}")
        print(f"Occurrences: {pattern['occurrences']}")
        if 'wasted_energy' in pattern:
            print(f"Wasted Energy: {pattern['wasted_energy']:.2f} kWh")
    
    print("\nComprehensive Energy-Saving Recommendations:")
    print("=" * 80)
    
    def print_section_header(title):
        print(f"\n{title}")
        print("=" * 80)
        
    def print_recommendation(number, rec):
        print(f"\nRecommendation #{number}:")
        print("-" * 40)
        print(f"Category: {rec['category']}")
        print(f"Device/Area: {rec['device']}")
        print(f"Issue: {rec['issue']}")
        print("Specific Actions to Take:")
        if isinstance(rec['recommendation'], list):
            for j, sub_rec in enumerate(rec['recommendation'], 1):
                print(f"  {j}. {sub_rec}")
        else:
            print(f"  • {rec['recommendation']}")
        print(f"Potential Savings: {rec['potential_savings']}")
    
    # Print summary of all recommendations
    print_section_header("SUMMARY OF RECOMMENDATIONS")
    print(f"Total number of recommendations: {len(recommendations)}")
    for category in ['Critical', 'High Priority', 'Medium Priority', 'General', 'Behavioral']:
        count = len([r for r in recommendations if r['category'] == category])
        if count > 0:
            print(f"{category}: {count} recommendations")
            
    # Print detailed recommendations
    print_section_header("DETAILED RECOMMENDATIONS")
    
    # Sort recommendations by priority
    priority_order = {
        'Critical': 1,
        'High Priority': 2,
        'Medium Priority': 3,
        'General': 4,
        'Behavioral': 5
    }
    
    sorted_recommendations = sorted(
        recommendations,
        key=lambda x: (priority_order.get(x['category'], 99), x['device'])
    )
    
    # Print each recommendation with clear formatting
    for i, rec in enumerate(sorted_recommendations, 1):
        print_recommendation(i, rec)
    
    print("\n" + "=" * 80)
    print("ADDITIONAL INFORMATION:")
    print("-" * 40)
    print("• Daily energy consumption pattern has been saved as 'daily_consumption_pattern.png'")
    print("• Implementing multiple recommendations together can lead to higher cumulative savings")
    print("• Regular monitoring and adjustment of these measures is recommended for optimal results")
    print("=" * 80)

if __name__ == "__main__":
    main()