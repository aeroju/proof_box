const chartOption={
    "title": {
        "text": '温湿度记录'
    },
    "tooltip": {
        "trigger": 'axis',
    },
    "legend": {
      "type":'scroll',
    },
    "toolbox": {
      "show": false,
      "feature": {
        "dataZoom": {
          "yAxisIndex": 'none'
        },
        "dataView": { "readOnly": false },
        "magicType": { "type": ['line', 'bar'] },
        "restore": {},
        "saveAsImage": {}
      }
    },
    "xAxis": {
        "type": 'category',
        "boundaryGap": false,
        "splitLine": {
            "show": true
        },
        "data":[]
    },
    "yAxis": {
        "type": 'value',
        "axisLabel": {
          "formatter": '{value}'
        },
    },
    "series": []
};

export default {chartOption}