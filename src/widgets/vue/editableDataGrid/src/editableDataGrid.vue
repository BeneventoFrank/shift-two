<template>
<div :style="`position:relative; display:flex; min-width:${gridSettings.size.GridWidth}; height:${gridSettings.size.GridHeight}; flex-direction:column; align-items:center;`">
    <div :style="`position:absolute; width:${gridSettings.size.GridWidth}; height:${gridSettings.size.gridHeight};display: flex; flex-direction: column; align-items: center; `">
        <div ref='grid' :style="`height:${gridSettings.size.GridHeight}; width:${gridSettings.size.GridWidth};`" >
            <div ref='gridHeader' id='gridHeader'>
                <div ref="pagination" :style="`display:flex; flex-direction:row; width:${gridSettings.size.GridWidth}; justify-content:center; align-items:flex-end; flex-wrap:wrap; padding-bottom:12px;`">
                    <div :style="`width:50%; min-width:300px; display:flex; flex-direction:row; align-items:center;`">
                        <div :style="`width:300px; display:flex; flex-direction:row; justify-content:${gridSettings.size.GridWidthValue>=600?'flex-end':'center'};`">
                            <Slider @change="handleChangeNumberPerPage" 
                                    @initialValue="handleInitialValue" 
                                    v-show="gridSettings.slider.Enabled" 
                                    :width="gridSettings.slider.SliderWidth"
                                    :minValue="gridSettings.slider.MinValue"
                                    :maxValue="gridSettings.slider.MaxValue"
                                    :stepValue="gridSettings.slider.StepValue"
                                    :initialValue="gridSettings.slider.InitialValue"
                                    :colorScheme="gridSettings.colorScheme"
                            ></Slider>
                        </div>
                    </div>
                    <div :style="`width:50%; min-width:300px; display:flex; flex-direction:row; align-items:flex-end; margin-top:${gridSettings.size.GridWidthValue>=600?0:20}px; justify-content:${gridSettings.size.GridWidthValue>=600?'flex-end':'center'};`" class='pagination'>
                        <Pagination 
                            v-show="gridSettings.pagination.Enabled"
                            :cmpCanPagePrevious="cmpCanPagePrevious"
                            :cmpCanPageNext="cmpCanPageNext"
                            :pagination="gridSettings.pagination"
                            @pageDataForward="handleNextClick"
                            @pageDataBackwards="handlePreviousClick"
                            :colorScheme="gridSettings.colorScheme"
                        ></Pagination>
                    </div>
                </div>
                <div style='display:flex; flex-direction:row;'>
                    <div style="width:20%;">
                        <div @mouseenter="handleShowCancelEye" class='pointer eye'  v-show="!isHovering&&(filterStrategy.isCurrentlyFiltering||sortStrategy.isCurrentlySorting)"><Eye :color="gridSettings.colorScheme.ActiveIndicatorColor" :height='25'/></div>
                        <div @mouseleave="handleShowCancelEye" @click="handleClearAllFilters" class='pointer tooltip eye' v-show="isHovering" ><CancelEye :height='25' /></div>
                    </div>
                    <div ref="title" style="width:60%;"><span class='title' :style="`color:${gridSettings.colorScheme.GridTitleColor}`" v-if="gridSettings.title.Enabled" >{{gridSettings.title.Text}}</span></div>
                    <div style="width:20%;"></div>
                </div>
                

                <div ref="headerRow" v-if="gridSettings.header.Enabled" :style="`width:100%;`">
                <HeaderRow 
                                @columnSort="handleColumnSort" 
                                @filterClosed="handleFilterClosed" 
                                @filterApplied="handleApplyFilter" 
                                @filterCleared="handleClearFilter"
                                :gridWillScroll="boolGridWillScroll" 
                                :currentSort="sortStrategy" 
                                :isDoneFiltering="isDoneFiltering"
                                :isDoneSorting="isDoneSorting" 
                                :currentFilters="filterStrategy" 
                                :clearAllFilters="clearAllFilters"
                                :gridSettings="gridSettings">
                </HeaderRow>
                </div>
            </div>
            <div ref='dataRow' class='dataRow' :style="`width:${gridSettings.size.GridWidth}; overflow-x:hidden;  position:relative; height:${gridSettings.developmentMode.Enabled?100:gridSettings.size.GridHeightValue-headerHeight}px`">
                <table class='dataGrid' :style="`cellpadding:0; cellspacing:0; padding-top:${gridSettings.developmentMode.Enabled?0:0}px; position:relative; padding-bottom:5px; overflow-x:scroll; width:100%;`">
                    <tr :class="`row ${rowIndex%2===0&&shouldAnimate&&!this.gridSettings.developmentMode.Enabled?'animateLeft':''} ${rowIndex%2!==0&&shouldAnimate&&!this.gridSettings.developmentMode.Enabled?'animateRight':''} ${shouldReverseAnimate?'reverseAnimation':''}`" 
                    :style="`border-spacing:0px; 
                            background-color:${rowIndex%2===0?gridSettings.colorScheme.GridRowEvenBackgroundColor:gridSettings.colorScheme.GridRowOddBackgroundColor};
                            cursor:pointer; 
                            overflow:hidden; 
                            width:100%;
                            border-collapse:collapse; 
                            height:35px;
                            align-items:center; 
                            display:flex;`" v-for="(dataRow,rowIndex) in dataSlice" :key="rowIndex">
                        <td :style="`width:${gridSettings.columns[colIndex].Width}; white-space:nowrap; text-overflow:ellipsis; overflow:hidden; display:block;
                                    color:${gridSettings.colorScheme.GridRowTextColor}; text-align:${gridSettings.columns[colIndex].Alignment};`" v-for="(column,colIndex) in gridSettings.columns"  :key="colIndex">{{dataRow.data[colIndex]}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <div v-if="gridSettings.developmentMode.Enabled" :class="`configTool ${shouldAnimateConfigTool?'animateConfigTool':null}`" style="display:flex; flex-direction:row; box-shadow: 0px 0px 27px -13px black; min-width:600px; position:absolute; z-index:10000; margin-top:270px; justify-content:center; ">
        <div style="border-radius:5px; background-color:#F8F8F8; min-width:600px; max-width:600px; height:380px; border:1px solid grey; ">
            <div style="height:5%; border-top-right-radius:5px; border-top-left-radius:5px; background-color:#577594; display:flex;flex-direction:row; justify-content:center;">
                <span style="color:white;">{{developerModeText}}</span>
            </div>
            <div style="height:93%; display:flex;flex-direction:row; justify-content:center;">
                <div style="width:25%; display:flex; flex-direction:column;">
                    <div @click="setCurrentTab('welcome')" class='tab' :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='welcome'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='welcome'?'#f2ecdc':'slateGrey'}; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex;`"><span style="width:100%">Welcome</span></div>
                    <div @click="setCurrentTab('size')" class='tab' :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='size'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='size'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Size</span></div>
                    <div @click="setCurrentTab('title')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='title'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='title'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Title</span></div>
                    <div @click="setCurrentTab('header')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='header'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='header'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Header</span></div>
                    <div @click="setCurrentTab('rows')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='rows'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='rows'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Rows</span></div>
                    <div @click="setCurrentTab('columns')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='columns'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='columns'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Columns</span></div>
                    <div @click="setCurrentTab('paging')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='paging'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='paging'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Slider/Paging</span></div>
                    <div @click="setCurrentTab('generate')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='generate'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='generate'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Generate Config</span></div>
                    <div :style="`background-color:#dbd9d3; border-right:1px solid slateGrey;flex-grow:1;`">
                    </div>
                </div>
                <div v-show="currentTab==='welcome'" style="width:75%; background-color:#f2ecdc; padding:20px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <span style="padding-bottom:40px; font-size:20px;">Welcome to the grid configuration tool.</span>
                    <span style="padding-bottom:20px; font-size:14px;">Use the tabs on the left to configure your grid exactly as you want it. When you are done, use the <b>Generate Config</b> tab to download your settings.</span>
                    <span style="padding-bottom:20px; font-size:14px;">You may re-open this tool at any point by turning on developmentMode in your config</span>
                    <span style="font-size:14px; ">Thanks for picking Shift-Grid, tell us what you think. </span>
                    <span style="font-size:14px; "><a href='www.shift-two.com'>www.shift-two.com</a></span>
                    
                </div>
                <div v-show="currentTab==='title'" style="width:75%; padding:35px; background-color:#f2ecdc; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:flex-start;">
                        <div style="display:flex; width:100%; justify-content:flex-start;">
                            <div style="width:150px; display:flex; justify-content:flex-start"><span>Enable Title</span></div>
                            <div>
                                <input type="checkbox" @change="handleEnableTitle" v-model="chkEnableTitle" id="enableTitle" name="enableTitle" value="true">
                            </div>
                        </div>                                                 
                        <div style="display:flex; width:100%; justify-content:flex-start; margin-top:15px;">
                            <div style="width:150px; display:flex; justify-content:flex-start"><span>Title Color</span></div>
                            <div style='display:flex; align-items:center;'>
                                <input @input="(event)=>{debounceColorChange(event,'title')}" v-model="activeColorScheme.gridTitleColor"  type='text' style="width:100px" height="30px">
                                <input type='color' @input="(event)=>{handleColorPickerChange(event,'title')}" class='colorPicker' :value='activeColorScheme.gridTitleColor'>
                            </div>
                        </div>    
                    </div>
                </div>
                <div v-show="currentTab==='size'" style="width:75%; padding:35px; background-color:#f2ecdc; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start;">
                                <div style="width:100px; display:flex; justify-content:flex-start"><span>Grid Width</span></div>
                                <div><input @input="debounceInput" v-model="devModeWidthValue"  type='number' style="width:75px" height="30px"><span> px</span></div>
                            </div>    
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:15px;">
                                <div style="width:100px; display:flex; justify-content:flex-start"><span>Grid Height</span></div>
                                <div><input type='number' @input="debounceHeightInput" v-model="devModeHeightValue" style="width:75px" height="30px"><span> px</span></div>
                            </div>   
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='columns'" style="width:75%; padding:35px; display:flex; flex-direction:column; align-items:flex-start; background-color:#f2ecdc; justify-content:flex-start;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; flex-direction:row; align-items:center; justify-content:flex-start;">
                                <span style="margin-right:15px;">Number Of Columns</span>
                                <input type="number" id="quantity" @change="handleColNumChange" name="quantity" v-model="numColumns" min="1" max='25' style="width:45px" height="30px">
                            </div>
                            <div style='width:100%; margin-top:15px; display:flex; flex-direction:row; align-items:center; justify-content:flex-start;'>
                                <label style="margin-right:36px;" for="columns">Choose a column</label>
                                <select @change="handleColumnEdit" style="width:200px;" name="columns" id="columns">
                                    <option :value="-1">Select To Edit</option>
                                    <option v-for="(column, index) in gridSettings.columns" :key="index" :value="index">{{`header - ${column.ColumnHeader}`}}</option>
                                </select>                                
                            </div>
                            <br>
                            <hr v-show="columnSelected!==-1" style="width:100%; height:1px;">
                            <br>
                            <div v-show="columnSelected!==-1" style='width:100%; display:flex; flex-direction:column; align-items:center;'>
                                <div style="display:flex; width:100%;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span>Column Header</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><input @input="handleHeaderChange" type='text' v-model="activeColumnEdit.ColumnHeader" style='width:100%'></div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:15px;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span>Custom Width</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><input @input="handleCustomWidth" type='number' v-model="activeColumnEdit.WidthValue" style='width:100px;'><span>px</span></div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:15px;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span>Data Alignment</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <select @input="handleDataAlignment" v-model="activeColumnEdit.Alignment" style="width:100px;" name="alignment" id="alignment">
                                            <option value='left'>left</option>
                                            <option value='center'>center</option>
                                            <option value='right'>right</option>
                                        </select>                                        
                                    </div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:15px;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span>Data Type</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <select @input="handleDataPropertyChange" v-model="activeColumnEdit.DataType" style="width:100px;" name="dataType" id="dataType">
                                            <option value='string'>string</option>
                                            <option value='number'>number</option>
                                        </select>                                        
                                    </div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:15px;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span>Enable Pre-sort</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <input @change="handleEnablePreSort" v-model="activeColumnEdit.IsPreSortEnabled" style="margin:0;" type="checkbox" id="enablePresort" name="enablePresort" value="true">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='paging'" style="width:75%; padding:35px; display:flex; flex-direction:column; background-color:#f2ecdc; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">

                            <div style="display:flex; width:100%; justify-content:flex-start;">
                                <div style="width:150px; display:flex; justify-content:flex-start"><span>Enable Paging</span></div>
                                <div>
                                    <input type="checkbox" @change="handleEnablePaging" v-model="chkEnablePaging" id="enablePaging" name="enablePaging" value="true">
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:15px;">
                                <div style="width:150px; display:flex; justify-content:flex-start"><span></span>Paging Text Color</div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ptc')}" v-model="activeColorScheme.pagingTextColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ptc')}" class='colorPicker' :value='activeColorScheme.pagingTextColor'>
                                </div>
                            </div>                         
                            <br>
                            <hr style="height: 1px; width: 100%;">
                            <br>
                            <div style="display:flex; width:100%; justify-content:flex-start;">
                                <div style="width:150px; display:flex; justify-content:flex-start"><span>Enable Slider</span></div>
                                <div>
                                    <input type="checkbox" @change="handleEnableSlider" v-model="chkEnableSlider" id="enableSlider" name="enableSlider" value="true">
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start;margin-top:15px;">
                                <div style="width:150px; display:flex; justify-content:flex-start;"><span>Slider Fill Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'sfc')}" v-model="activeColorScheme.sliderFillColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'sfc')}" class='colorPicker' :value='activeColorScheme.sliderFillColor'>
                                </div>
                            </div>   
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='rows'" style="width:75%; display:flex; padding:35px; background-color:#f2ecdc; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span></span>Grid Row Odd Background Color</div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'grobc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.gridRowOddBackgroundColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'grobc')}" class='colorPicker' :value='activeColorScheme.gridRowOddBackgroundColor'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span>Grid Row Even Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'grebc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.gridRowEvenBackgroundColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'grebc')}" class='colorPicker' :value='activeColorScheme.gridRowEvenBackgroundColor'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span>Grid Row Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'grtc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.gridRowTextColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'grtc')}" class='colorPicker' :value='activeColorScheme.gridRowTextColor'>
                                </div>
                            </div>   
  
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='generate'" style="width:75%; background-color:#f2ecdc; display:flex; padding:35px; flex-direction:column; align-items:center; justify-content:center;">
                    <div style='display:flex; justify-content:center; margin-bottom:25px'>
                        <span>Choose Download Option</span>
                    </div>
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span></span>Download as .js - ready to drop in.</div>
                                <div><button @click="download">Download</button></div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span>Download as a renamable .js.txt file</span></div>
                                <div><button @click="(event)=>{download(event,'txt')}">Download</button></div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span>Download as a .zip file</span></div>
                                <div><button @click="(event)=>{download(event,'zip')}">Download</button></div>
                            </div>   
                          </div>
                    </div>
                </div>
                <div v-show="currentTab==='header'" style="width:75%; background-color:#f2ecdc; display:flex; flex-direction:column; padding:35px; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span>Enable Header Row</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input type="checkbox" @change="handleEnableHeader" v-model="chkEnableHeader" id="enableHeader" name="enableHeader" value="true">                                    
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span></span>Grid Header Background Color</div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ghbc')}" v-model="activeColorScheme.gridHeaderBackgroundColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ghbc')}" class='colorPicker' :value='activeColorScheme.gridHeaderBackgroundColor'>
                                </div>
                            </div>  
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span></span>Grid Header Text Color</div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ghtc')}" v-model="activeColorScheme.gridHeaderTextColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ghtc')}" class='colorPicker' :value='activeColorScheme.gridHeaderTextColor'>
                                </div>

                            </div>  
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span>Grid Header Divider Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ghboc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.gridHeaderBorderColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ghboc')}" class='colorPicker' :value='activeColorScheme.gridHeaderBorderColor'>
                                </div>

                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span>Flyout Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'fbc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.flyoutBackgroundColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'fbc')}" class='colorPicker' :value='activeColorScheme.flyoutBackgroundColor'>
                                </div>

                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span>Flyout Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ftc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.flyoutTextColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ftc')}" class='colorPicker' :value='activeColorScheme.flyoutTextColor'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span>Active Indicator Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'aic')}" v-model="activeColorScheme.activeIndicatorColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'aic')}" class='colorPicker' :value='activeColorScheme.activeIndicatorColor'>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>

            </div>
            <div style="height:2%; border-bottom-right-radius:5px; border-bottom-left-radius:5px; background-color:#577594;">
                &nbsp;
            </div>
        </div> 
    </div>
</div>
</template>
<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import sampleGridData from '../data/sampleRowData'
import debounce from 'lodash.debounce'
import HeaderRow from './components/HeaderRow'
import ShiftSettings from '../settings/shift-two-grid-defaults'
import forwardWorker from './webWorkers/forwardFilterWorker'
import reverseWorker from './webWorkers/reverseFilterWorker'
import evenSortWorker from './webWorkers/evenSortWorker'
import oddSortWorker from './webWorkers/oddSortWorker'
import sortWorker from './webWorkers/sortWorker'
import forwardWorkerSetup from './webWorkers/forwardFilterServiceWorkerSetup'
import reverseWorkerSetup from './webWorkers/reverseFilterServiceWorkerSetup'
import evenSortWorkerSetup from './webWorkers/sortWorkerSetup'
import oddSortWorkerSetup from './webWorkers/sortWorkerSetup'
import sortWorkerSetup from './webWorkers/sortWorkerSetup'
import Pagination from '../../pagination/Pagination'
import Slider from '../../slider/Slider'
import Eye from '../src/images/Eye'
import CancelEye from '../src/images/CancelEye'

export default {
    name:"EditableDataGrid",
    components: {
        HeaderRow,
        Slider,
        Pagination,
        Eye,
        CancelEye
    },
    data() {
        return {
            activeColorScheme:{
                sliderFillColor:'',
                pagingTextColor:'',
                gridTitleColor:'',
                gridHeaderTextColor:'',
                gridRowTextColor:'',
                gridHeaderBackgroundColor:'',
                gridRowOddBackgroundColor:'',
                gridRowEvenBackgroundColor:'',
                activeIndicatorColor:'',
                gridHeaderBorderColor:'',
                flyoutBackgroundColor:'',
                flyoutTextColor:''
            },
            devModeWidthValue:0,
            devModeHeightValue:0,
            activeColumnEdit:{
                ColumnHeader:'',
                Index:0,
                Width:'',
                WidthValue:0,
                Alignment:'',
                DataType:'',
                IsPreSortEnabled:false                 
            },
            columnSelected:-1,
            numColumns:4,
            chkEnablePaging:true,
            chkEnableSlider:true,
            chkEnableTitle:true,
            chkEnableHeader:true,
            shouldAnimate:false,
            shouldReverseAnimate:false,
            developmentMode:false,
            shouldAnimateConfigTool:false,
            developerModeText:'',
            headerHeight:0, //calculated total of the header use to dictate the height of datarow.
            highestScrollPosition:0,
            fullDS:[],
            weAreUsingTheSlider:false,
                                                            sliderCount:false,
            sortedData:{},
            isDonePreSorting:false,
            filterCount:0,
            scrollCount:0,
            currentTab:'welcome',
            tmpResults:[],
            boolGridWillScroll:false,
            tmpResultsSort:{},
            highestCountLoaded:0,
            numberOfTerminatedFilters:0,
            numberOfTerminatedSorts:0,
            dataSlice:[],
            isHovering:false,
            isHoverOverCell:true,
            rowCurrentlyHoveringOver:null,
            cellCurrentlyHoveringOver:null,
            clearAllFilters:false,
            curentlyHovering:0,
            filteredData:[],
            userHasHeaders:false,
            isDoneFiltering:true,
            isDoneSorting:true,
            sortStrategy:{
                isCurrentlySorting:false,
                strategy:'',
                direction:'',
                columnBeingSorted:null
            },
            filterStrategy:{
                isCurrentlyFiltering:false,
                filters:[],
                columnsBeingFiltered:[]
            },
            ww_forwardWorker1:null,
            ww_reverseWorker1:null,
            ww_forwardWorker2:null,
            ww_reverseWorker2:null,
            ww_evenSortWorker:null,
            ww_oddSortWorker:null,
            gridSettings:{
                developmentMode:{
                },
                size:{
                },
                colorScheme:{
                },
                title:{
                },
                header:{
                },
                slider:{
                },
                pagination:{
                }
            },
        };
    },
    computed: {
        cmpCanPagePrevious:function(){
            return this.gridSettings.pagination.MinRecordsViewable<2?false:true
        },
        cmpCanPageNext:function(){
            return (this.gridSettings.pagination.MaxPageNumberPossible>1?true:false)&&(this.gridSettings.pagination.PageNumberCurrentlyViewing<this.gridSettings.pagination.MaxPageNumberPossible)
        }        
    },
    methods: {
        handleEnableTitle(){
            this.gridSettings.title.Enabled=this.chkEnableTitle
        },
        handleEnableHeader(){
            this.gridSettings.header.Enabled=this.chkEnableHeader
        },
        handleColorPickerChange(event, code){
            switch (code) {
                case 'ftc':
                    this.activeColorScheme.flyoutTextColor = event.target.value
                    this.gridSettings.colorScheme.FlyoutTextColor = event.target.value
                    break;
                case 'fbc':
                    this.activeColorScheme.flyoutBackgroundColor = event.target.value
                    this.gridSettings.colorScheme.FlyoutBackgroundColor = event.target.value
                    break;
                case 'ghboc':
                    this.activeColorScheme.gridHeaderBorderColor = event.target.value
                    this.gridSettings.colorScheme.GridHeaderBorderColor = event.target.value
                    break;
                case 'aic':
                    this.activeColorScheme.activeIndicatorColor = event.target.value
                    this.gridSettings.colorScheme.ActiveIndicatorColor = event.target.value
                    break;
                case 'grebc':
                    this.activeColorScheme.gridRowEvenBackgroundColor = event.target.value
                    this.gridSettings.colorScheme.GridRowEvenBackgroundColor = event.target.value
                    break;
                case 'grobc':
                    this.activeColorScheme.gridRowOddBackgroundColor = event.target.value
                    this.gridSettings.colorScheme.GridRowOddBackgroundColor = event.target.value
                    break;
                case 'grtc':
                    this.activeColorScheme.gridRowTextColor = event.target.value
                    this.gridSettings.colorScheme.GridRowTextColor = event.target.value
                    break;
                case 'ghbc':
                    this.activeColorScheme.gridHeaderBackgroundColor = event.target.value
                    this.gridSettings.colorScheme.GridHeaderBackgroundColor = event.target.value
                    break;
                case 'ghtc':
                    this.activeColorScheme.gridHeaderTextColor = event.target.value
                    this.gridSettings.colorScheme.GridHeaderTextColor = event.target.value
                    break;
                case 'title':
                    this.activeColorScheme.gridTitleColor = event.target.value
                    this.gridSettings.colorScheme.GridTitleColor = event.target.value
                    break;
                case 'sfc':
                    this.activeColorScheme.sliderFillColor = event.target.value
                    this.gridSettings.colorScheme.SliderFillColor = event.target.value
                    break;
                case 'ptc':
                    this.activeColorScheme.pagingTextColor = event.target.value
                    this.gridSettings.colorScheme.PagingTextColor = event.target.value
                    break;

                default:
                    break;
            }            
        },
        generateConfig(){
let config = `let shiftSettings = {
    developmentMode:{
        Enabled:false
    },
    size:{
        GridWidth:'${this.gridSettings.size.GridWidthValue}px', //px value of width
        GridWidthValue:${this.gridSettings.size.GridWidthValue},
        GridHeight:'${this.gridSettings.size.GridHeightValue}px', //px value of height
        GridHeightValue:${this.gridSettings.size.GridHeightValue}, //int value used for calculations
    },
    header:{
        Enabled:${this.gridSettings.header.Enabled}
    },
    rows:{
        Height:'${this.gridSettings.rows.HeightValue}px',
        HeightValue:${this.gridSettings.rows.HeightValue}
    },
    slider:{
        Enabled:${this.gridSettings.slider.Enabled},
        SliderWidth:${this.gridSettings.slider.SliderWidth},
        MinValue:${this.gridSettings.slider.MinValue},
        MaxValue:${this.gridSettings.slider.MaxValue},
        StepValue:${this.gridSettings.slider.StepValue},
        InitialValue:${this.gridSettings.slider.InitialValue}
    },
    pagination:{
        Enabled:${this.gridSettings.pagination.Enabled},
        MinRecordsViewable:0,
        MaxRecordsViewable:0,
        TotalNumberOfRecords:0,
        PageNumberCurrentlyViewing:0,        
        MaxPageNumberPossible:0,
        NumberOfApplicibleRowsPerPage:0,
        InitialNumberOfRowsPerPage:0
    },
    title:{
        Text:'${this.gridSettings.title.Text}'
    },
    colorScheme:{
        SliderFillColor:'${this.gridSettings.colorScheme.SliderFillColor}',
        PagingTextColor:'${this.gridSettings.colorScheme.PagingTextColor}',
        GridTitleColor:'${this.gridSettings.colorScheme.GridTitleColor}',
        GridHeaderTextColor:'${this.gridSettings.colorScheme.GridHeaderTextColor}',
        GridRowTextColor:'${this.gridSettings.colorScheme.GridRowTextColor}',
        GridHeaderBackgroundColor:'${this.gridSettings.colorScheme.GridHeaderBackgroundColor}',
        GridRowOddBackgroundColor:'${this.gridSettings.colorScheme.GridRowOddBackgroundColor}',
        GridRowEvenBackgroundColor:'${this.gridSettings.colorScheme.GridRowEvenBackgroundColor}',
        ActiveIndicatorColor:'${this.gridSettings.colorScheme.ActiveIndicatorColor}',
        GridHeaderBorderColor:'${this.gridSettings.colorScheme.GridHeaderBorderColor}',
        FlyoutBackgroundColor:'${this.gridSettings.colorScheme.FlyoutBackgroundColor}',
        FlyoutTextColor:'${this.gridSettings.colorScheme.FlyoutTextColor}'
    },
    columns:[
`           
            let column = ``
            for (let i = 0; i < this.gridSettings.columns.length; i++) {
                column = 
`        {
            ColumnHeader:'${this.gridSettings.columns[i].ColumnHeader}',
            Index:${this.gridSettings.columns[i].Index},
            Width:'${this.gridSettings.columns[i].Width}',
            WidthValue:${this.gridSettings.columns[i].WidthValue},
            IsUsingACustomWidth:${this.gridSettings.columns[i].IsUsingACustomWidth},
            Alignment:'${this.gridSettings.columns[i].Alignment}',
            DataType:'${this.gridSettings.columns[i].DataType}',
            IsPreSortEnabled:${this.gridSettings.columns[i].IsPreSortEnabled}                            
        },
`                
            config += column
            }
            config += `
    ]
}
export default shiftSettings
`    
            return config        
        },
        
        download(event,downloadAs) {
            let element
            let zip = new JSZip();
            switch (downloadAs) {
                
                case 'zip':
                        zip.file("shift-grid-config.js", this.generateConfig());
                        zip.generateAsync({type: "blob"}).then(function(content) {
                            FileSaver.saveAs(content, "Config.zip");
                            });                    
                    break;
                case 'txt':
                        element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.generateConfig()));
                        element.setAttribute('download', 'shift-grid-config.js.txt')
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    break;
                default:
                        element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.generateConfig()));
                        element.setAttribute('download', 'shift-grid-config.js')
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    break;
            }
        },
         
        handleCustomWidth(event){
            this.gridSettings.columns[this.activeColumnEdit.Index].Width=event.target.value+'px';
            this.gridSettings.columns[this.activeColumnEdit.Index].WidthValue=parseInt(event.target.value);
            this.gridSettings.columns[this.activeColumnEdit.Index].IsUsingACustomWidth=event.target.value>0
            this.calculateColumnWidths()            
        },
        handleDataAlignment(event){
            this.gridSettings.columns[this.activeColumnEdit.Index].Alignment = event.target.value
        },
        handleDataPropertyChange(){
            this.gridSettings.columns[this.activeColumnEdit.Index].DataType = event.target.value
        },
        handleEnablePreSort(event){
            this.gridSettings.columns[this.activeColumnEdit.Index].IsPreSortEnabled=event.target.value;
        },
        handleHeaderChange(){
            this.gridSettings.columns[this.activeColumnEdit.Index].ColumnHeader=event.target.value;
        },
        handleColumnEdit(event){
            if (event.target.value>-1) {
            this.columnSelected=event.target.value;
                this.activeColumnEdit = {
                    ColumnHeader:this.gridSettings.columns[event.target.value].ColumnHeader,
                    Index:this.gridSettings.columns[event.target.value].Index,
                    Width:this.gridSettings.columns[event.target.value].Width,
                    WidthValue:this.gridSettings.columns[event.target.value].WidthValue,
                    Alignment:this.gridSettings.columns[event.target.value].Alignment,
                    DataType:this.gridSettings.columns[event.target.value].DataType,
                    IsPreSortEnabled:this.gridSettings.columns[event.target.value].IsPreSortEnabled 
                }            
                
            } else {
                this.activeColumnEdit={
                    ColumnHeader:'',
                    Index:0,
                    Width:'',
                    WidthValue:0,
                    Alignment:'',
                    DataType:'',
                    IsPreSortEnabled:false                 
                }
            }
        },
        handleColNumChange(event){

            if (this.gridSettings.columns.length<event.target.value) {
                let numToPush = event.target.value - this.gridSettings.columns.length
                let index = this.gridSettings.columns.length
                for (let i = 0; i < numToPush; i++) {
                    this.gridSettings.columns.push(
                        {
                            ColumnHeader:'Column',
                            Index:index,
                            Width:'',
                            WidthValue:0,
                            Alignment:'',
                            DataType:'string',
                            IsPreSortEnabled:false                            
                        }
                    )
                    index++
                }

                for (let j = 0; j < numToPush; j++) {

                    for (let i = 0; i < this.fullDS.length; i++) {
                        this.fullDS[i].data.push('Data')
                    }
                }
            } else {
                let currentCount = this.gridSettings.columns.length
                let numToPop = currentCount - event.target.value
                let tmp = [...this.gridSettings.columns]
                this.gridSettings.columns = tmp.splice(0,currentCount-numToPop)
            }
            this.calculateColumnWidths()            
        },
        handleEnablePaging(event){
            this.gridSettings.pagination.Enabled = event.target.checked; 
            if (this.gridSettings.pagination.Enabled===false){
                this.gridSettings.slider.Enabled=false
                this.chkEnableSlider = false
            }

        },
        handleEnableSlider(event){
            this.gridSettings.slider.Enabled = event.target.checked;            
        },
        setCurrentTab(tab){
            this.currentTab = tab
        },
        handleInitialValue(event){
            this.sliderCount = event
        },
        handleClearAllFilters(){
            this.sortStrategy = {
                isCurrentlySorting:false,
                strategy:'',
                columnBeingSorted:''
            }
            this.filterStrategy = {
                isCurrentlyFiltering:false,
                filters:[],
                columnsBeingFiltered:[]
            }
            this.clearAllFilters = true
            this.highestCountLoaded = this.getInitialRowsPerPage();
            this.filteredData = []
            this.filteredData = this.fullDS 
            this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)   
            this.reConfigurePagination(this.sliderCount)                    
        },
        handleShowCancelEye(){
            this.isHovering = !this.isHovering
        },
        fetchRecordsFromDS(start,stop){
            return this.fullDS.slice(start,stop+1)
        },    
        debounceInput: debounce(function (event){
            this.gridSettings.size.GridWidth = `${event.target.value}px`
            this.gridSettings.size.GridWidthValue = parseInt(event.target.value)
            this.calculateColumnWidths()
        },750),     
        debounceHeightInput: debounce(function (event){
            this.gridSettings.size.GridHeight = `${event.target.value}px`
            this.gridSettings.size.GridHeightValue = parseInt(event.target.value)
        },750),               
        debounceHeaderChange: debounce(function (event){
            this.gridSettings.title.Text = event.target.value
        },750),      
        debounceColorChange: debounce(function (event, code){
            let tmpField = ''
            switch (code) {
                case 'ftc':
                    tmpField = 'FlyoutTextColor'
                    break;
                case 'fbc':
                    tmpField = 'FlyoutBackgroundColor'
                    break;
                case 'ghboc':
                    tmpField = 'GridHeaderBorderColor'
                    break;
                case 'aic':
                    tmpField = 'ActiveIndicatorColor'
                    break;
                case 'grebc':
                    tmpField = 'GridRowEvenBackgroundColor'
                    break;
                case 'grobc':
                    tmpField = 'GridRowOddBackgroundColor'
                    break;
                case 'grtc':
                    tmpField = 'GridRowTextColor'
                    break;
                case 'ghbc':
                    tmpField = 'GridHeaderBackgroundColor'
                    break;
                case 'ghtc':
                    tmpField = 'GridHeaderTextColor'
                    break;
                case 'title':
                    tmpField = 'GridTitleColor'
                    break;
                case 'sfc':
                    tmpField = 'SliderFillColor'
                    break;
                case 'ptc':
                    tmpField = 'PagingTextColor'
                    break;

                default:
                    break;
            }
            this.gridSettings.colorScheme[tmpField] = event.target.value
        },750),      


        reConfigurePagination(count){
            let tmp = []
            if (this.filterStrategy.isCurrentlyFiltering||this.sortStrategy.isCurrentlySorting){
                tmp = this.filteredData
            } else{
                tmp = this.fullDS
            }
            let paging = {
                MinRecordsViewable:1,
                MaxRecordsViewable:tmp.length<count?tmp.length:count,
                TotalNumberOfRecords:tmp.length,
                PageNumberCurrentlyViewing:1,        
                MaxPageNumberPossible:Math.ceil(tmp.length/count),
                NumberOfApplicibleRowsPerPage:count,
                IsPaging:false,
                CurrentSkip:0,
                CurrentTake:0
            }
            this.pagination = paging          
        },
        handleChangeNumberPerPage(event){
            if(this.gridSettings.developmentMode.Enabled){return} 

            this.weAreUsingTheSlider=true
            let count = parseInt(event.target.value)
            this.sliderCount = count
            this.reConfigurePagination(count);
            let tmp = []
            if (this.filterStrategy.isCurrentlyFiltering||this.sortStrategy.isCurrentlySorting){
                tmp = this.filteredData
            } else{
                tmp = this.fullDS
            }
            let processed=[]
            for (let i = 0; i < count; i++) {
                if(tmp[i]){
                    processed.push(tmp[i])
                }
            }

            this.boolGridWillScroll = this.gridWillScroll(processed.length)
            this.dataSlice = processed;
        },            
        async handleNextClick(isASingleMove){
            this.pageDataForward(isASingleMove.isASinglePageMove)
            const start = (this.pagination.PageNumberCurrentlyViewing*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage
            const end = start + this.pagination.NumberOfApplicibleRowsPerPage
            this.dataSlice = this.fetchRecordsFromDS(start,end)
        },
        async handlePreviousClick(isASingleMove){
            this.pageDataBackward(isASingleMove.isASinglePageMove)
            const start = (this.pagination.PageNumberCurrentlyViewing*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage
            const end = ((this.pagination.PageNumberCurrentlyViewing+1)*this.pagination.NumberOfApplicibleRowsPerPage)-(this.pagination.NumberOfApplicibleRowsPerPage)
            this.dataSlice = this.fetchRecordsFromDS(start,end)
        },
        pageDataBackward(isASinglePageMove){
        if(isASinglePageMove){
                const paging = {
                MinRecordsViewable:((this.pagination.PageNumberCurrentlyViewing-1)*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage<=0?1:((this.pagination.PageNumberCurrentlyViewing-1)*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage,
                MaxRecordsViewable:this.pagination.MaxRecordsViewable-this.pagination.NumberOfApplicibleRowsPerPage>0?(this.pagination.MaxRecordsViewable-(this.pagination.MaxRecordsViewable-this.pagination.NumberOfApplicibleRowsPerPage)):this.pagination.MaxRecordsViewable,
                TotalNumberOfRecords:this.pagination.TotalNumberOfRecords,
                PageNumberCurrentlyViewing:this.pagination.PageNumberCurrentlyViewing-1,        
                MaxPageNumberPossible:this.pagination.MaxPageNumberPossible,
                NumberOfApplicibleRowsPerPage:this.pagination.NumberOfApplicibleRowsPerPage,
                IsPaging:this.pagination.PageNumberCurrentlyViewing-1===1?false:true,
                CurrentSkip:this.pagination.CurrentSkip-this.pagination.NumberOfApplicibleRowsPerPage,
                CurrentTake:this.pagination.NumberOfApplicibleRowsPerPage
                }
                this.pagination = paging
        } else {
                const paging = {
                MinRecordsViewable:1,
                MaxRecordsViewable:this.pagination.NumberOfApplicibleRowsPerPage,
                TotalNumberOfRecords:this.pagination.TotalNumberOfRecords,
                PageNumberCurrentlyViewing:1,        
                MaxPageNumberPossible:Math.ceil(this.pagination.TotalNumberOfRecords/this.pagination.NumberOfApplicibleRowsPerPage),
                NumberOfApplicibleRowsPerPage:this.pagination.NumberOfApplicibleRowsPerPage,
                IsPaging:false,
                CurrentSkip:0,
                CurrentTake:this.pagination.NumberOfApplicibleRowsPerPage         
                }
                this.pagination = paging          
        }
        },
        pageDataForward(isASinglePageMove){
            if(isASinglePageMove){
                let tmp = this.pagination.MinRecordsViewable===1?this.pagination.NumberOfApplicibleRowsPerPage:this.pagination.MinRecordsViewable+this.pagination.NumberOfApplicibleRowsPerPage
                let paging = {
                    MinRecordsViewable:tmp,
                    MaxRecordsViewable:tmp+this.pagination.NumberOfApplicibleRowsPerPage>this.pagination.TotalNumberOfRecords?this.pagination.TotalNumberOfRecords:tmp+this.pagination.NumberOfApplicibleRowsPerPage,
                    TotalNumberOfRecords:this.pagination.TotalNumberOfRecords,
                    PageNumberCurrentlyViewing:this.pagination.PageNumberCurrentlyViewing+1,        
                    MaxPageNumberPossible:this.pagination.MaxPageNumberPossible,
                    NumberOfApplicibleRowsPerPage:this.pagination.NumberOfApplicibleRowsPerPage,
                    IsPaging:true,
                    CurrentSkip:this.pagination.CurrentSkip+this.pagination.NumberOfApplicibleRowsPerPage,
                    CurrentTake:this.pagination.NumberOfApplicibleRowsPerPage
                }
                this.pagination = paging
            } else {
                const paging = {
                    MinRecordsViewable:this.pagination.TotalNumberOfRecords - (this.pagination.TotalNumberOfRecords - this.pagination.NumberOfApplicibleRowsPerPage) ,
                    MaxRecordsViewable:this.pagination.TotalNumberOfRecords,
                    TotalNumberOfRecords:this.pagination.TotalNumberOfRecords,
                    PageNumberCurrentlyViewing:this.pagination.MaxPageNumberPossible,        
                    MaxPageNumberPossible:this.pagination.MaxPageNumberPossible,
                    NumberOfApplicibleRowsPerPage:this.pagination.NumberOfApplicibleRowsPerPage,
                    IsPaging:true,
                    CurrentSkip:(this.pagination.MaxPageNumberPossible*this.pagination.NumberOfApplicibleRowsPerPage)-this.pagination.NumberOfApplicibleRowsPerPage,
                    CurrentTake:this.pagination.NumberOfApplicibleRowsPerPage         
                }
                this.pagination = paging
            }
        },
        initializePaging(numberOfRowsPerPage){
            if (this.gridSettings.slider.Enabled) {
                let minValue, maxValue, stepValue, initialValue,sliderWidth = 0
                    if(numberOfRowsPerPage===10){
                        minValue=10, maxValue=100, stepValue=10, initialValue=100,sliderWidth = 300    
                    } else if(numberOfRowsPerPage===100){
                        minValue=100, maxValue=1000, stepValue=100, initialValue=100,sliderWidth = 300    
                    } else if(numberOfRowsPerPage===1000){
                        minValue=500, maxValue=4000, stepValue=500, initialValue=1000,sliderWidth = 300    
                    }                    
                    this.gridSettings.slider.MinValue = minValue;
                    this.gridSettings.slider.MaxValue = maxValue;
                    this.gridSettings.slider.StepValue = stepValue;
                    this.gridSettings.slider.InitialValue = initialValue;
                    this.gridSettings.slider.SliderWidth = sliderWidth;
            }
            if(this.gridSettings.pagination.Enabled===true){
                this.gridSettings.pagination = {
                Enabled:true,
                MinRecordsViewable:1,
                MaxRecordsViewable:this.fullDS.length>this.gridSettings.slider.InitialValue?this.gridSettings.slider.InitialValue:this.fullDS.length,
                TotalNumberOfRecords:this.fullDS.length,
                PageNumberCurrentlyViewing:1,                   
                MaxPageNumberPossible:Math.ceil(this.fullDS.length/this.gridSettings.slider.InitialValue),
                NumberOfApplicibleRowsPerPage:numberOfRowsPerPage,
                }
            } 
        },
        getInitialRowsPerPage(){
            if (this.weAreUsingTheSlider) {
                return this.sliderCount //investigate this see how its used and set
            } else {
                if((this.fullDS.length>=0)&&(this.fullDS.length<=100)){
                    return 100
                } else if((this.fullDS.length>100)&&(this.fullDS.length<=1000)){
                    return 1000
                } else if(this.fullDS.length>1000){
                    return 4000
                }
            }
        },        
        gridWillScroll(numberOfRows){
            let retVal = false
            let height = 0
            if(this.gridSettings.size.GridHeight){
                if(this.gridSettings.size.GridHeight.includes('p')){
                    height = this.gridSettings.size.GridHeight.split('p')[0]
                }
            }
            let tmp = 0
            if (this.filterStrategy.isCurrentlyFiltering||this.sortStrategy.isCurrentlySorting){
                tmp = this.filteredData.length
            } else{
                if(numberOfRows){
                    tmp = numberOfRows
                } else {
                    tmp = this.fullDS.length
                }
            }
            if (tmp*31>height)
            {
                retVal=true
            }
            return retVal
        
        },
        handleColumnSort(strategy){
            if(this.gridSettings.developmentMode.Enabled){return} 
            this.isDoneSorting = false
           
            if(strategy !== ''){
                    if(this.filterStrategy.isCurrentlyFiltering){
                        this.ww_sortWorker.postMessage({'MessageType':'sortFilteredData','SortStrategy':strategy, 'Data':this.filteredData})
                    } else {
                        const split = strategy.split('^^')
                        const tmp = parseInt(split[0])
                        if(this.isDonePreSorting&&this.gridSettings.columns[tmp].IsPreSortEnabled)
                        {
                            this.sortStrategy = {}
                            this.sortStrategy.strategy = strategy
                            this.sortStrategy.isCurrentlySorting = true
                            this.sortStrategy.columnBeingSorted = tmp
                            this.sortStrategy.direction = split[1]
                            this.filteredData = []
                            this.filteredData = this.sortedData[tmp][split[1]]
                            this.dataSlice = this.filteredData.slice(0,this.getInitialRowsPerPage())
                            this.isDoneSorting = true;
                        } else {
                            this.ww_sortWorker.postMessage({'MessageType':'applySort','SortStrategy':strategy})
                        }
                    }
            } else {
                this.sortStrategy={
                    isCurrentlySorting:false,
                    strategy:'',
                    columnBeingSorted:null
                }
                this.isDoneSorting = true;
                if(this.filterStrategy.isCurrentlyFiltering){
                    this.ww_forwardWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_forwardWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_reverseWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_reverseWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                } else {
                    this.highestCountLoaded = this.getInitialRowsPerPage();
                    this.filteredData = []
                    this.filteredData = this.fullDS 
                    this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                }
            }

        },
        handleFilterClosed(){
            if(this.gridSettings.developmentMode.Enabled){return} 
            this.filterCount = 0
        },
        calculateColumnWidths(){
            let tmp = 0
            const numCols = this.gridSettings.columns.length
            let custCols = [] 
            for (let i = 0; i < numCols; i++) {
                if (this.gridSettings.columns[i].IsUsingACustomWidth) {
                    custCols.push(i)
                    tmp = tmp + this.gridSettings.columns[i].WidthValue
                }
            }


           const numColumns = numCols-custCols.length
           let widthOfGrid = this.gridSettings.size.GridWidthValue - tmp
           widthOfGrid = this.boolGridWillScroll?(widthOfGrid*.975):widthOfGrid
           const eachColumn = Math.round(widthOfGrid/numColumns)
            for (let i = 0; i < numCols; i++) {
                if (!custCols.includes(i)) {
                    this.gridSettings.columns[i].Width = `${eachColumn}px`
                    this.gridSettings.columns[i].WidthValue = eachColumn
                }
            }
        },
        translateAlignment(val){
           switch (val) {
            case 'left':
                return 'flex-start'                   
            case 'right':
                return 'flex-end'                   
            default:
                return 'center'
           }
        },
        handleMessage(message){
            let tmp = []
            switch (message.data.MessageType) {
                case 'filterResults':
                    if (message.data.Data.length>0) {
                        tmp = [...this.tmpResults, ...message.data.Data]
                        this.tmpResults = tmp
                    }
                    this.clearAllFilters = false
                    this.filterStrategy.isCurrentlyFiltering=true
                    break;
                case 'allFiltersApplied':
                    if (message.data.Data.length>0) {
                        tmp = [...this.tmpResults, ...message.data.Data]
                        this.tmpResults = tmp
                    }
                    this.clearAllFilters = false
                    this.filterStrategy.isCurrentlyFiltering=true
                    break;                                
                case 'originalData': 
                    if (message.data.Data.length>0) {
                        tmp = [...this.tmpResults, ...message.data.Data]
                        this.tmpResults = tmp
                    }
                    this.clearFilters()
                    break;
                case 'sortComplete':
                        this.filteredData = [...message.data.Data]
                        this.sortStrategy = {}
                        this.sortStrategy.strategy = message.data.Strategy
                        this.sortStrategy.isCurrentlySorting = true
                        this.sortStrategy.columnBeingSorted = message.data.Column

                        this.highestCountLoaded = this.getInitialRowsPerPage();
                        this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                        this.filterCount = 0
                        this.tmpResults = []
                        this.isDoneSorting = true
                        this.reConfigurePagination(this.sliderCount)
                    break;
                case 'dataSorted':
                    this.tmpResultsSort= {...this.tmpResultsSort, ...message.data.Data}
                    break;
                case 'sortTerminated':
                    this.numberOfTerminatedSorts = this.numberOfTerminatedSorts +1                      
                    if(this.numberOfTerminatedSorts===2)    
                    {
                        this.sortedData = this.tmpResultsSort
                        this.isDonePreSorting = true
                        this.ww_oddSortWorker.terminate()
                        this.ww_evenSortWorker.terminate()
                    }
                    
                    break;
                case 'filterTerminated':
                    this.numberOfTerminatedFilters = this.numberOfTerminatedFilters +1                      
                    if(this.numberOfTerminatedFilters===4)    
                    {
                        if(this.sortStrategy.isCurrentlySorting===true){
                            this.ww_sortWorker.postMessage({'MessageType':'sortFilteredData', 'SortStrategy':this.sortStrategy.strategy, 'Data': this.tmpResults})
                            this.numberOfTerminatedFilters = 0
                            this.isDoneFiltering=true
                        } else {
                            this.filteredData = this.tmpResults
                            this.highestCountLoaded = this.getInitialRowsPerPage();
                            this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                            this.filterCount = 0
                            this.numberOfTerminatedFilters = 0
                            this.tmpResults = []
                            this.isDoneFiltering=true
                            if (this.filteredData.length>this.sliderCount) {
                                this.reConfigurePagination(this.sliderCount)
                            } else {
                                this.reConfigurePagination(this.filteredData.length)
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        handleClearFilter(columnIndex){
            if(this.gridSettings.developmentMode.Enabled){return} 
            if(this.filterStrategy.isCurrentlyFiltering){
                if(this.filterStrategy.columnsBeingFiltered.length===1&&this.filterStrategy.columnsBeingFiltered[0] === columnIndex.toString()){
                    this.clearFilters()
                    if (this.sortStrategy.isCurrentlySorting) {
                            const split = this.sortStrategy.strategy.split('^^')
                            this.filteredData = this.sortedData[split[0]][split[1]]
                            this.highestCountLoaded = this.getInitialRowsPerPage();
                            this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                    } else {
                            this.highestCountLoaded = this.getInitialRowsPerPage();
                            this.filteredData = []
                            this.filteredData = this.fullDS 
                            this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)                        
                    }
                } else {
                    //then clear a filter was called on a column but other filters are applied. 
                    this.clearAFilter(columnIndex)
                    this.ww_forwardWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_forwardWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_reverseWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    this.ww_reverseWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                }

                if(this.sortStrategy.isCurrentlySorting===true){
                    this.ww_sortWorker.postMessage({'MessageType':'applySort', 'SortStrategy':this.sortStrategy.strategy})
                } 
                this.reConfigurePagination(this.sliderCount)               
            }
        },
        clearAFilter(col){
            let tmp = []
            let tmpCol = []
            for (let i = 0; i < this.filterStrategy.filters.length; i++) {
                let split = this.filterStrategy.filters[i].split('^^')
                if(split[0]!==col.toString()){
                    tmpCol.push(split[0])
                    tmp.push(this.filterStrategy.filters[i])
                }
            }
            this.filterStrategy = {
                                    isCurrentlyFiltering:true,
                                    filters:tmp,
                                    columnsBeingFiltered:tmpCol
                                  }
        },
        handleApplyFilter(strategy){
            if(this.gridSettings.developmentMode.Enabled){return} 
            const addFilter = (col,filter) =>{ 
                this.filterStrategy.isCurrentlyFiltering = true
                this.filterStrategy.filters.push(`${col}^^${filter}`)
                this.filterStrategy.columnsBeingFiltered.push(col)
            }
            const updateFilter = (col,filter) =>{
                this.filterStrategy.isCurrentlyFiltering = true
                for (let i = 0; i < this.filterStrategy.filters.length; i++) {
                    let split = this.filterStrategy.filters[i].split('^^')
                    if(split[0]===col){
                        this.filterStrategy.filters[i] = `${col}^^${filter}`
                        break;
                    }
                }
            }
            let split = strategy.split('^^')
            let col = split[0]
            let filter = split[1]
            if(this.filterStrategy.isCurrentlyFiltering){ //if we are filtering
                if(this.filterStrategy.columnsBeingFiltered.includes(col)){
                    updateFilter(col,filter)
                    this.isDoneFiltering=false

                    if(this.filterStrategy.columnsBeingFiltered.length>1){ 
                        this.ww_forwardWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                        this.ww_forwardWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                        this.ww_reverseWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                        this.ww_reverseWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                    } 
                    if(this.filterStrategy.columnsBeingFiltered.length===1){ 
                        this.ww_forwardWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                        this.ww_forwardWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                        this.ww_reverseWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false}) 
                        this.ww_reverseWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false}) 
                    } 
   
                } else {
                    addFilter(col,filter)
                    this.isDoneFiltering=false
                    this.ww_forwardWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true})  
                    this.ww_forwardWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true})  
                    this.ww_reverseWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true}) 
                    this.ww_reverseWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':true}) 
                }
            } else {
                //then we are adding the only filter
                    addFilter(col,filter)
                    this.isDoneFiltering=false
                    this.ww_forwardWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                    this.ww_forwardWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false})  
                    this.ww_reverseWorker1.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false}) 
                    this.ww_reverseWorker2.postMessage({'MessageType':'filter','Strategy':strategy,'IsCurrentlyFiltering':false}) 
            }
        },
        clearFilters(){
            this.filterStrategy = {
                                    isCurrentlyFiltering:false,
                                    filters:[],
                                    columnsBeingFiltered:[]
                                  }
        },
        calculateHeightOfDataRow(){
            let tmp=0;
            const height = this.gridSettings.size.GridWidthValue<600?91:51;
            this.gridSettings.header.Enabled?tmp=tmp+51:null
            this.gridSettings.pagination.Enabled?tmp=tmp+height:null
            this.gridSettings.title.Text.length>0?tmp=tmp+28:null
            return tmp
        },
        processConfig(){
            let tmp = null
            if (Object.keys(this.gridConfig).length>0) {
                //then we have a config object to process.
                tmp = {...this.gridConfig}
            } else {
                //here b/c we have no config object so we need to load all Shift Defaults into the grid settings object.
                tmp = {...ShiftSettings}
            }
            this.gridSettings = tmp
        },
        processData(){
            const GetRandomDataSet = ()=>{
                let num = Math.floor(Math.random() * 3)
                while (num<=0||num>3) {
                    num = Math.floor(Math.random() * 3)
                }
                return sampleGridData[num]
            }
            
            let tmp = []
            if (this.gridData.length>0) {
                //load the data from the prop
                tmp = this.gridData
            } else {
                //load some random data.
                tmp = GetRandomDataSet()
            }
            this.fullDS = tmp            
            this.dataSlice = tmp.slice(0,this.getInitialRowsPerPage())

        },
        configureWebWorkers(){
            let tmpFor1 = []
            let tmpFor2 = []
            let tmpRev1 = []
            let tmpRev2 = []
            let firstHalf = Math.ceil(Math.ceil(this.fullDS.length/2)/2)
            let counter = 0
            for (let i = 0; i < (Math.ceil(this.fullDS.length/2)); i++) {
                if(i<firstHalf){
                    tmpFor1.push(this.fullDS[i])
                }else{
                    tmpFor2.push(this.fullDS[i])
                }
            }
            for (let i = Math.ceil(this.fullDS.length/2); i < this.fullDS.length; i++) {
                counter++
                if(counter<=firstHalf){
                    tmpRev1.push(this.fullDS[i])
                }else{
                    tmpRev2.push(this.fullDS[i])
                }
            }

            this.ww_forwardWorker1 = new forwardWorkerSetup(forwardWorker)
            this.ww_forwardWorker1.addEventListener('message',event =>{this.handleMessage(event)})
            this.ww_forwardWorker1.postMessage({'MessageType':'data','Data':tmpFor1, 'Columns':this.gridSettings.columns})
            
            this.ww_forwardWorker2 = new forwardWorkerSetup(forwardWorker)
            this.ww_forwardWorker2.addEventListener('message',event =>{this.handleMessage(event)})
            this.ww_forwardWorker2.postMessage({'MessageType':'data','Data':tmpFor2, 'Columns':this.gridSettings.columns})

            this.ww_reverseWorker1 = new reverseWorkerSetup(reverseWorker)
            this.ww_reverseWorker1.addEventListener('message',event =>{this.handleMessage(event)})
            this.ww_reverseWorker1.postMessage({'MessageType':'data','Data':tmpRev1, 'Columns':this.gridSettings.columns})

            this.ww_reverseWorker2 = new reverseWorkerSetup(reverseWorker)
            this.ww_reverseWorker2.addEventListener('message',event =>{this.handleMessage(event)})
            this.ww_reverseWorker2.postMessage({'MessageType':'data','Data':tmpRev2, 'Columns':this.gridSettings.columns})

            this.ww_evenSortWorker = new evenSortWorkerSetup(evenSortWorker)
            this.ww_evenSortWorker.addEventListener('message',event => {this.handleMessage(event)})
            this.ww_evenSortWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.gridSettings.columns})

            this.ww_oddSortWorker = new oddSortWorkerSetup(oddSortWorker)
            this.ww_oddSortWorker.addEventListener('message',event => {this.handleMessage(event)})
            this.ww_oddSortWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.gridSettings.columns})

            this.ww_sortWorker = new sortWorkerSetup(sortWorker)
            this.ww_sortWorker.addEventListener('message',event => {this.handleMessage(event)})
            this.ww_sortWorker.postMessage({'MessageType':'data','Data':this.fullDS, 'Columns':this.gridSettings.columns})
        },
        initializeDevMode(){
            this.devModeWidthValue = this.gridSettings.size.GridWidthValue
            this.devModeHeightValue = this.gridSettings.size.GridHeightValue
            this.activeColorScheme.sliderFillColor = this.gridSettings.colorScheme.SliderFillColor,
            this.activeColorScheme.pagingTextColor = this.gridSettings.colorScheme.PagingTextColor,
            this.activeColorScheme.gridTitleColor = this.gridSettings.colorScheme.GridTitleColor,
            this.activeColorScheme.gridHeaderTextColor = this.gridSettings.colorScheme.GridHeaderTextColor,
            this.activeColorScheme.gridRowTextColor = this.gridSettings.colorScheme.GridRowTextColor,
            this.activeColorScheme.gridHeaderBackgroundColor = this.gridSettings.colorScheme.GridHeaderBackgroundColor,
            this.activeColorScheme.gridRowOddBackgroundColor = this.gridSettings.colorScheme.GridRowOddBackgroundColor,
            this.activeColorScheme.gridRowEvenBackgroundColor = this.gridSettings.colorScheme.GridRowEvenBackgroundColor,
            this.activeColorScheme.activeIndicatorColor = this.gridSettings.colorScheme.ActiveIndicatorColor,
            this.activeColorScheme.gridHeaderBorderColor = this.gridSettings.colorScheme.GridHeaderBorderColor,
            this.activeColorScheme.flyoutBackgroundColor = this.gridSettings.colorScheme.FlyoutBackgroundColor,
            this.activeColorScheme.flyoutTextColor = this.gridSettings.colorScheme.FlyoutTextColor
            this.chkEnablePaging = this.gridSettings.pagination.Enabled
            this.chkEnableSlider = this.gridSettings.slider.Enabled
            this.chkEnableTitle = this.gridSettings.title.Enabled 
            this.chkEnableHeader = this.gridSettings.header.Enabled
            
            this.dataSlice = [...this.fullDS].slice(0,2)
        },
        timeout(ms){
            return new Promise(resolve => setTimeout(resolve, ms))    
        }
        
    },
    props:{
        gridConfig:{
            type: Object,
            required: false,
            default: ()=>{return{}}
        }, 
        gridData:{
            type:Array,
            required: false,
            default: ()=>{return[]}
        }

    },        
    async mounted(){
        this.processConfig();
        this.processData();
        this.boolGridWillScroll = this.gridWillScroll()
        this.calculateColumnWidths()
        this.gridSettings.pagination.Enabled?this.initializePaging(this.getInitialRowsPerPage()):null
        this.headerHeight = this.calculateHeightOfDataRow()
        if(this.gridSettings.developmentMode.Enabled){
            this.initializeDevMode()
            setTimeout(async() => {
            this.gridSettings.size.GridHeight = '270px;'
            this.gridSettings.size.GridHeightValue = 270
            this.shouldAnimateConfigTool = true 
                setTimeout(async() => {
                    const tmp='Developer Mode'.split('')
                    for (let i = 0; i < tmp.length; i++) {

                        this.developerModeText = this.developerModeText + tmp[i]
                        await this.timeout(250)
                    }
                    
                }, 0);                
            }, 0);

        } else {
            this.configureWebWorkers()
            this.shouldAnimate = true //make this a config setting.
            setTimeout(() => {
                this.shouldReverseAnimate=true   
            }, 500);
        }
    }
};
</script>
<style >
        .pointer {
            cursor: pointer;
        }
        html {
        scroll-behavior: smooth;
        }
        .cell{
            width:20%;
        }
        .row{
            height:auto;
            max-height:30px;
            transition:transform .5s;
        }
        .animateLeft{
            transform: translate(-30px,0px)
        }
        .animateRight{
            transform: translate(30px,0px)
        }
        .reverseAnimation{
            transform: translate(0px,0px) 
        }
        .dataRow{
            width:100%; 
            display:flex; 
            flex-direction:row;
            scroll-behavior: smooth;
        }

        .dataGrid{

        }
        .dataGrid tr:hover{
            background-color: #E8E8E8;
        }
        td, th {
        padding:0px;
        position: relative;
        outline: 0;
        }
        td:hover {
            background-color: #DCDCDC;

        }
        tr{
            padding-top: 5px;
            padding-bottom: 5px;
        }
        .title{
            font-size:24px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        }
        .pagination{
            width: 100%;
            display:flex;
            flex-direction: row;
            justify-content: flex-end;
        }
        .tooltip {
        position: relative;
        display: inline-block;
        }

        .tooltip .tooltiptext {
            visibility: hidden;
            width: 200px;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
            top: 0px;
            left:50px;
        }
        .tooltip:hover .tooltiptext {
            visibility: visible;
        }
        .eye{
            display:flex;
            flex-direction: row;
            align-items: flex-end;
        }
        .configTool{
            max-height:0px;
            height:auto;
            overflow:hidden;
            max-height:30px;
            transition:max-height 1.5s;            
        }
        .animateConfigTool{
            max-height:380px;
        }
        .tab{
            justify-content: flex-start;
            align-items:center;
        }
        .tab :hover{
            transform: scale(1.1);
        }
        .colorPicker{
            border:none;
            cursor: pointer;
            height:30px; 
            background-color:transparent;
            width:30px;
            border-radius:5px;
            outline: none;
        }

</style>
