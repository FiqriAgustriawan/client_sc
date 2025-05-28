export const chartTheme = {
  primary: "#4F46E5",
  secondary: "#10B981",
  tertiary: "#F59E0B",
  quaternary: "#EC4899",
  gray: "#94A3B8",
  background: "#F8FAFC",
  backgroundDark: "#1E293B",
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
};

export const chartDefaultOptions = {
  chart: {
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
      },
      autoSelected: "zoom",
    },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
    fontFamily: "Inter, system-ui, sans-serif",
    background: "transparent",
  },
  grid: {
    borderColor: "#E2E8F0",
    strokeDashArray: 2,
    padding: {
      top: 5,
      right: 15,
      bottom: 5,
      left: 15,
    },
  },
  tooltip: {
    enabled: true,
    theme: "light",
    style: {
      fontSize: "12px",
      fontFamily: "Inter, system-ui, sans-serif",
    },
    y: {
      formatter: function (value) {
        return `${value.toLocaleString()}`;
      },
    },
    shared: true,
    intersect: false,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontWeight: 500,
    fontSize: "13px",
    markers: {
      width: 10,
      height: 10,
      radius: 6,
    },
    itemMargin: {
      horizontal: 10,
      vertical: 5,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 3,
    curve: "smooth",
    lineCap: "round",
  },
};