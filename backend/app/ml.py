# Placeholder ML logic
def estimate_cost(kwh: float) -> float:
    # Flat rate example
    return round(kwh * 0.18, 4)

def detect_anomaly(kwh: float) -> tuple[bool, str | None]:
    # Very naive anomaly flag
    if kwh > 5.0:
        return True, "High usage spike"
    return False, None
