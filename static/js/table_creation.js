fcolumns = [{data: 'Pupils'},
            {data: 'Group'},
            {data: 'C&L'},
            {data: 'PD'},
            {data: 'PSED'},
            {data: 'L'},
            {data: 'M'},
            {data: 'UoW'},
            {data: 'EAD'},
            {data: 'On track for GLD'}]
            
ks1columns = [{data: 'Pupils'},
            {data: 'R/W'},
            {data: 'M'},
            {data: 'Group'},
            {data: 'GLD (yes/no)'},
            {data: 'Reading'},
            {data: 'Writing'},
            {data: 'Maths'},
            {data: 'Combined (yes/no)'},
            {data: 'Phonics (scores/40)'}]

ks2columns = [{data: 'Pupils'},
            {data: 'R/W'},
            {data: 'M'},
            {data: 'Group'},
            {data: 'GLD (yes/no)'},
            {data: 'Phonics (scores/40)'},
            {data: 'Reading'},
            {data: 'Writing'},
            {data: 'Maths'},
            {data: 'Combined (yes/no)'},
            {data: 'Grammer'},
            {data: 'TTables (score/25)'}]

$(document).ready(function(){
    function load_foundation(data){
        var formatted_data = []
        for(let i =0; i<data.length; i++){
            formatted_data.push({
                "Pupils": data[i][0],
                "Group": data[i][1],
                "C&L": data[i][2],
                "PD": data[i][3],
                "PSED": data[i][4],
                "L": data[i][5],
                "M": data[i][6],
                "UoW": data[i][7],
                "EAD": data[i][8],
                "On track for GLD": data[i][9]
            })
        }
        return formatted_data
    }
    function load_ks1(data){
        var formatted_data = []
        for(let i =0; i<data.length; i++){
            formatted_data.push({
                'Pupils': data[i][0],
                'R/W': data[i][1],
                'M': data[i][2],
                'Group': data[i][3],
                'GLD (yes/no)': data[i][4],
                'Reading': data[i][5],
                'Writing': data[i][6],
                'Maths': data[i][7],
                'Combined (yes/no)': data[i][8],
                'Phonics (scores/40)': data[i][9]
            })
        }
        return formatted_data
    }

    function load_ks2(data){
        var formatted_data = []
        for(let i =0; i<data.length; i++){
            formatted_data.push({
                'Pupils': data[i][0],
                'R/W': data[i][1],
                'M': data[i][2],
                'Group': data[i][3],
                'GLD (yes/no)': data[i][4],
                'Phonics (scores/40)': data[i][5],
                'Reading': data[i][6],
                'Writing': data[i][7],
                'Maths': data[i][8],
                'Combined (yes/no)': data[i][9],
                'Grammer': data[i][10],
                'TTables (score/25)': data[i][11]
            })
        }
        return formatted_data
    }

    var table
    var table_name
    var table_stage
    var removed = 0
    fetch('/load_table/foundation').then(response => response.json()).then(json =>{
        table = new DataTable('#foundation',{
            data: load_foundation(json),
            columns: fcolumns,
            info: false,
            ordering: false,
            paging: false
            //scrollY: 300
        })
        table_name = 'foundation'
        table_stage = 'foundation'

        document.querySelectorAll('td').forEach(cell => {cell.contentEditable = true})
        for(let i =0; i<json.length; i++){check_on_track(i)}
        add_on_track_row()
    })
    

    function click_cell(cell){
        table = new DataTable(cell.parentElement.parentElement.parentElement)
    }

    function blur_cell(cell){
        table = new DataTable(cell.parentElement.parentElement.parentElement)
        //change specific cell data
        table.cell(table.cell(cell)[0][0]['row'],table.cell(cell)[0][0]['column']).data($(table.cell(cell).node()).html()).draw()
        check_on_track(table.cell(cell)[0][0]['row'])
        update_percentages()
    }

    function check_on_track(row){
        switch (table_stage){
            case "foundation":
                found_on_track(row)
                break
            case "ks1":
                ks1_on_track(row)
                break
            default:
                ks2_on_track(row)
                break
        }
    }

    function found_on_track(row){
        var on_track = 'yes'
        for(var i=2; i < 9; i++){
            $(table.cell(row,i).node()).removeClass('pass fail')
            if(table.cell(row,i).data().includes('@-')){
                $(table.cell(row,i).node()).addClass('fail')
                on_track = 'no'
            }
            else if (table.cell(row,i).data().includes('@')){$(table.cell(row,i).node()).addClass('pass')}
        }
        table.cell(row,9).data(on_track).draw()
        if (on_track == 'yes'){$(table.cell(row,9).node()).addClass('pass')}
        else{$(table.cell(row,9).node()).addClass('fail')}
    }
    
    function ks1_on_track(row){
        var on_track = 'yes'
        for(var i=5; i < 8; i++){
            $(table.cell(row,i).node()).removeClass('pass fail')
            if(table.cell(row,i).data().includes('@-')){
                $(table.cell(row,i).node()).addClass('fail')
                on_track = 'no'
            }
            else if (table.cell(row,i).data().includes('@')){$(table.cell(row,i).node()).addClass('pass')}
        }
        table.cell(row,8).data(on_track).draw()
        if (on_track == 'yes'){$(table.cell(row,8).node()).addClass('pass')}
        else{$(table.cell(row,8).node()).addClass('fail')}
        
        // check the phonics score
        if(parseInt(table.cell(row,9).data()) < 32){
            $(table.cell(row,9).node()).addClass('fail')
            on_track = 'no'
        }
        else if (parseInt(table.cell(row,9).data()) >= 32){$(table.cell(row,9).node()).addClass('pass')}
    }
    
    function ks2_on_track(row){
        var on_track = 'yes'
        for(var i=6; i < 9; i++){
            $(table.cell(row,i).node()).removeClass('pass fail')
            if(table.cell(row,i).data().includes('@-')){
                $(table.cell(row,i).node()).addClass('fail')
                on_track = 'no'
            }
            else if (table.cell(row,i).data().includes('@')){$(table.cell(row,i).node()).addClass('pass')}
        }
        table.cell(row,9).data(on_track).draw()
        if (on_track == 'yes'){$(table.cell(row,9).node()).addClass('pass')}
        else{$(table.cell(row,9).node()).addClass('fail')}

        // check the phonics score
        if(parseInt(table.cell(row,5).data()) < 32){
            $(table.cell(row,5).node()).addClass('fail')
            on_track = 'no'
        }
        else if (parseInt(table.cell(row,5).data()) < 32){$(table.cell(row,5).node()).addClass('pass')}
    }

    function add_row(){
        table.row(':last').remove().draw(false);
        removed +=1
        if(table_stage != 'foundation'){
            removed +=1
            table.row(':last').remove().draw();}
        switch (table_stage){
            case "foundation":
                table.row.add({"Pupils" : "", "Group" : "", "C&L": "", "PD": "", "PSED": "", "L": "", "M": "", "UoW": "", "EAD": "", "On track for GLD": ""}).draw()
                break
            case "ks1":
                table.row.add({'Pupils': "", 'R/W': "", 'M': "", 'Group': "", 'GLD (yes/no)': "", 'Reading': "", 'Writing': "", 'Maths': "", 'Combined (yes/no)': "", 'Phonics (scores/40)': ""}).draw(false)
                break
            default:
                table.row.add({'Pupils': "", 'R/W': "", 'M': "", 'Group': "", 'GLD (yes/no)': "", 'Phonics (scores/40)': "", 'Reading': "", 'Writing': "", 'Maths': "", 'Combined (yes/no)': "", 'Grammer': "", 'TTables (score/25)': ""}).draw(false)
                break
        }           
        document.querySelectorAll('td').forEach(cell => {cell.contentEditable = true})
        add_on_track_row()
    }

    /*function add_row(){
        var newrow;
        switch (table_stage){
            case "foundation":
                newrow = {"Pupils": "1", "Group": "1", "C&L": "1", "PD": "1", "PSED": "1", "L": "1", "M": "1", "UoW": "1", "EAD": "1", "On track for GLD": "1"}
                break
            case "ks1":
                newrow = {'Pupils': "1", 'R/W': "1", 'M': "1", 'Group': "1", 'GLD (yes/no)': "1", 'Reading': "1", 'Writing': "1", 'Maths': "1", 'Combined (yes/no)': "1", 'Phonics (scores/40)': "1"}
                break
            default:
                newrow = {'Pupils': "", 'R/W': "", 'M': "", 'Group': "", 'GLD (yes/no)': "", 'Phonics (scores/40)': "", 'Reading': "", 'Writing': "", 'Maths': "", 'Combined (yes/no)': "", 'Grammer': "", 'TTables (score/25)': ""}
                break
        }       
        table.row(':last').remove().draw();
        if(table_stage != 'foundation'){table.row(':last').remove().draw();}
        table.row.add(newrow).draw(false)
        document.querySelectorAll('td').forEach(cell => {cell.contentEditable = true})
        add_on_track_row()
    }*/

    function add_on_track_row(){
        var newrow;
        switch (table_stage){
            case "foundation":
                all = populate_on_track_row_foundation()
                newrow = {"Pupils": "N/A", "Group": "N/A", "C&L": all[0], "PD": all[1], "PSED": all[2], "L": all[3], "M": all[4], "UoW": all[5], "EAD": all[6], "On track for GLD": all[7]}
                break
            case "ks1":
                all = populate_on_track_row_ks1()
                newrow = {'Pupils': "N/A", 'R/W': "N/A", 'M': "N/A", 'Group': "N/A", 'GLD (yes/no)': "N/A", 'Reading': all[0], 'Writing': all[1], 'Maths': all[2], 'Combined (yes/no)': all[3], 'Phonics (scores/40)': all[4]}
                table.row.add(newrow).draw()
                break
            default:
                all = populate_on_track_row_ks2()
                newrow = {'Pupils': "N/A", 'R/W': "N/A", 'M': "N/A", 'Group': "N/A", 'GLD (yes/no)': "N/A", 'Phonics (scores/40)': all[0], 'Reading': all[1], 'Writing': all[2], 'Maths': all[3], 'Combined (yes/no)': all[4], 'Grammer': all[5], 'TTables (score/25)': all[6]}
                table.row.add(newrow).draw()
                break
        }        
        table.row.add(newrow).draw()
    }

    function update_percentages(){
        table.row(':last').remove().draw();
        if(table_stage != 'foundation'){table.row(':last').remove().draw();}
        add_on_track_row()
    }

    function populate_on_track_row_foundation(){
        var rows = table.rows().count() 
        var all = []
        for(var i=2; i<10;i++){
            var track_count = 0
            for(var j=0; j <= rows+removed-1; j++)
                if(table.cell(j,i).data() != undefined){
                    if(!(table.cell(j,i).data().includes('@-') || table.cell(j,i).data().includes('no'))){track_count += 1}
                }
            var percentage = Math.round((track_count/(rows)) *100) + '%'
            all.push(percentage)
            //table.cell(table.rows().count()-1,i).data(percentage).draw()
        }
        return all
    }

    function populate_on_track_row_ks1(){
        var rows = table.rows().count()
        var all = []
        for(var i=5; i<9;i++){
            var track_count = 0
            for(var j=0; j < rows+removed; j++){
                if(table.cell(j,i).data() != undefined){
                    if(!(table.cell(j,i).data().includes('@-') || table.cell(j,i).data().includes('no'))){track_count += 1}
                }
            }
            var percentage = Math.round((track_count/(rows)) *100) + '%'
            all.push(percentage)
        }
        //phonics
        track_count = 0
        for(var j=0; j < rows+removed; j++){
            if(table.cell(j,i).data() != undefined){
                if(!(parseInt(table.cell(j,9).data()) < 32)){track_count += 1}
            }
        }
        percentage = Math.round((track_count/(rows)) *100) + '%'
        all.push(percentage)
        return all
    }

    function populate_on_track_row_ks2(){
        var all = []
        var rows = table.rows().count()
        //phonics
        track_count = 0
        for(var j=0; j < rows+removed; j++)
            if(table.cell(j,i).data() != undefined){
                if(!(parseInt(table.cell(j,5).data()) < 32)){track_count += 1}
            }
        var percentage = Math.round((track_count/(rows)) *100) + '%'
        all.push(percentage)

        
        for(var i=6; i<11;i++){
            var track_count = 0
            for(var j=0; j < rows+removed; j++)
                if(table.cell(j,i).data() != undefined){
                    if(!(table.cell(j,i).data().includes('@-') || table.cell(j,i).data().includes('no'))){track_count += 1}
                }
            var percentage = Math.round((track_count/(rows)) *100) + '%'
            all.push(percentage)
        }

        //times tables
        var total = 0
        for(var j=0; j < rows+removed; j++){
            if(table.cell(j,i).data() != undefined){
                total += parseInt(table.cell(j,11).data())
            }
        }
        var average = (total/(rows)).toFixed(2)
        all.push(average)
        return all
    }

    function save_year(){
        var allData = table.data()
        var rows = []
        if(table_stage == 'foundation')
            for (var i=0; i<allData.length-1; i++){
                rows.push(allData[i])
            }
        else
            for (var i=0; i<allData.length-2; i++){
                rows.push(allData[i])
            }
        $.ajax({
            url: '/save_table/' + table_name+','+table_stage,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({'table': rows})
        }).then(response => {console.log(response)})
    }

    $('#year').on('change', async function(){
        removed = 0
        await save_year()
        table_name = this.value
        fetch('/load_table/'+table_name).then(response => response.json()).then(json =>{
            switch (table_name){
                case "foundation":
                    table_stage = 'foundation'
                    $('.foundation').show()
                    $('.ks1').hide()
                    $('.ks2').hide()
                    table.destroy()
                    table = new DataTable('#foundation',{
                        data: load_foundation(json),
                        columns: fcolumns,
                        info: false,
                        ordering: false,
                        paging: false,
                        searching: false
                    })
                    add_on_track_row()
                    break
                case "y1":
                case "y2":
                    table_stage = 'ks1'
                    $('.foundation').hide()
                    $('.ks1').show()
                    $('.ks2').hide()
                    table.destroy()
                    table = new DataTable('#ks1',{
                        data: load_ks1(json),
                        columns: ks1columns,
                        info: false,
                        ordering: false,
                        paging: false,
                        searching: false
                    })
                    add_on_track_row()
                    break
                default:
                    table_stage = 'ks2'
                    $('.foundation').hide()
                    $('.ks1').hide()
                    $('.ks2').show()
                    table.destroy()
                    table = new DataTable('#ks2',{
                        data: load_ks2(json),
                        columns: ks2columns,
                        info: false,
                        ordering: false,
                        paging: false,
                        searching: false
                    })
                    add_on_track_row()
                    break
            }  
            document.querySelectorAll('td').forEach(cell => {cell.contentEditable = true})
            for(let i =0; i<json.length; i++){check_on_track(i)}
        })
        switch (table_name){
            case "foundation":
                $('#title').text("Foundation")
                break
            case "y1":
                $('#title').text("KS1: Year 1")
                break
            case "y2":
                $('#title').text("KS1: Year 2")
                break
            case "y3":
                $('#title').text("KS2: Year 3")
                break
            case "y4":
                $('#title').text("KS2: Year 4")
                break
            case "y5":
                $('#title').text("KS2: Year 5")
                break
            case "y6":
                $('#title').text("KS2: Year 6")
                break
        }  
    })

    $('#foundation').on('click', 'tbody td:not(first-child)', function(){click_cell(this)});

    $('#foundation').on('blur', 'tbody td', function(){blur_cell(this)});

    $('.ks1').on('click', 'tbody td', function(){click_cell(this)});

    $('.ks1').on('blur', 'tbody td', function(){blur_cell(this)});

    $('.ks2').on('click', 'tbody td', function(){click_cell(this)});

    $('.ks2').on('blur', 'tbody td', function(){blur_cell(this)});

    $('#new_r').on('click', add_row)

    $('#save').on('click', async function(){
        await save_year()
        alert("Saved")
    })
})

