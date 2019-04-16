export function dateSplit(start,end){
    // 分割字符串
    let startArr = start.split("-");
    let endArr = end.split("-");
    let year = [];
    let month = [];
    let day = [];
    year.push(parseInt(startArr[0]),parseInt(endArr[0]));
    month.push(parseInt(startArr[1]),parseInt(endArr[1]));
    day.push(parseInt(startArr[2]),parseInt(endArr[2]));
    let y1 = year[0];
    let y2 = year[1];
    let m1 = month[0];
    let m2 = month[1];
    let d1 = day[0];
    let d2 = day[1];
    // 新的数组
    let TotalArr =[];
    let str = '';
    for(let y = y1 ; y <= y2; y++){
        str = `${y}`;
        for(let m = m1 ;m <= m2; m++){
            if(m < 10){
                str += `-0${m}`;
            }else{
                str += `-${m}`;
            }
            for(let d = d1;d <= d2;d++){
                if(d < 10){
                    str += `-0${d}`;
                }else{
                    str += `-${d}`;
                }
                TotalArr.push(str);
                //移除
                str = str.replace(`-${d}`,"");
                str = str.replace(`-0${d}`,"");
            }
            
            str = str.replace(`-${m}`,"");
            str = str.replace(`-0${m}`,"");
        }
    }
    return TotalArr;
}

// 验证日期是否存在
export function check(date){
    return (new Date(date).getDate()==date.substring(date.length-2));
}