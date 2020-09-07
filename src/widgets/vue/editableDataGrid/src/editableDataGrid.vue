<template>
<div :style="`position:relative; display:flex; min-width:${gridSettings.size.GridWidth}; height:${gridSettings.size.GridHeight}; flex-direction:column; align-items:center;`">
    <div :style="`position:absolute; width:${gridSettings.size.GridWidth}; height:${gridSettings.size.gridHeight};display: flex; flex-direction: column; align-items: center; `">
        <div ref='grid' :style="`height:${gridSettings.size.GridHeight}; width:${gridSettings.size.GridWidth};`" >
            <div ref='gridHeader' id='gridHeader'>
                <div ref="pagination" :style="`display:flex; flex-direction:row; width:${gridSettings.size.GridWidth}; justify-content:center; align-items:flex-end; flex-wrap:wrap; padding-bottom:12px;`">
                    <div :style="`width:50%; min-width:300px; display:flex; flex-direction:row; align-items:center;`">
                        <div v-if="gridSettings.slider.Enabled" :style="`width:300px; display:flex; flex-direction:row; justify-content:${gridSettings.size.GridWidthValue>=600?'flex-end':'center'};`">
                            <Slider @change="handleChangeNumberPerPage" 
                                    @initialValue="handleInitialValue" 
                                    :width="gridSettings.slider.SliderWidth"
                                    :minValue="gridSettings.slider.MinValue"
                                    :maxValue="gridSettings.slider.MaxValue"
                                    :stepValue="gridSettings.slider.StepValue"
                                    :initialValue="gridSettings.slider.InitialValue"
                                    :colorScheme="gridSettings.colorScheme"
                            ></Slider>
                        </div>
                    </div>
                    <div v-if="gridSettings.pagination.Enabled" :style="`width:50%; min-width:300px; display:flex; flex-direction:row; align-items:flex-end; margin-top:${gridSettings.size.GridWidthValue>=600?0:20}px; justify-content:${gridSettings.size.GridWidthValue>=600?'flex-end':'center'};`" class='pagination'>
                        <Pagination 
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



                
                <div id='viewport' @scroll='runScroller' :ref="`viewportElement`" :style="`height:${viewportHeight}px; overflow-y:auto; overflow-x:hidden;`">
                    <div :style="`display:flex; flex-direction:column;`">
                        <div :style="`height:${topPaddingHeight}px; `"></div>
                        <div class='item'
                            @mouseleave="()=>{hoverIndex=null}" 
                            @mouseenter="()=>{hoverIndex=item.rowIndex}"     
                            :style="`height:32px; display:flex; justify-content:center; 
                                     background-color:${gridSettings.rows.HighlightRowEnabled&&item.rowIndex===hoverIndex?gridSettings.colorScheme.RowHighlightBackground:item.rowIndex%2===0?gridSettings.colorScheme.GridRowEvenBackgroundColor:gridSettings.colorScheme.GridRowOddBackgroundColor} ;
                                    
                            `"
                            :class="`row ${item.rowIndex%2===0&&shouldAnimate&&!gridSettings.developmentMode.Enabled?'animateLeft':''} ${item.rowIndex%2!==0&&shouldAnimate&&!gridSettings.developmentMode.Enabled?'animateRight':''} ${shouldReverseAnimate?'reverseAnimation':''}`" 
                            v-for="(item) in data" :key="item.rowIndex">
                            <div
                                @mouseleave="()=>{cellHoverIndex=null}" 
                                @mouseenter="()=>{cellHoverIndex=index}"
                                v-for="(col,index) in item.data" :key="index"
                                :style="`display:flex; align-items:center; height:100%;
                                         width:${gridSettings.columns[index].Width};
                                         justify-content:center;
                                         background-color: ${gridSettings.rows.HighlightRowEnabled?item.rowIndex===hoverIndex&&index===cellHoverIndex?gridSettings.colorScheme.RowHighlightActiveCell:index===cellHoverIndex?gridSettings.colorScheme.RowHighlightBackground:'':''};
                                    `">
                                <span 
                                  :style="` white-space:nowrap; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; overflow:hidden; display:block;  
                                           color:${gridSettings.colorScheme.GridRowTextColor};
                                           vertical-align:center;
                                           text-align:${gridSettings.columns[index].Alignment};
                                         `" 
                                  > {{col}}{{item.rowIndex+1}}</span>
                            </div>
                        </div>
                        <div :style="`height:${bottomPaddingHeight}px;`"></div>
                    </div>
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
                <div v-show="currentTab==='size'" style="width:75%; padding:35px; background-color:#f2ecdc; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:flex-end;">
                                <div style="width:100px; display:flex; justify-content:flex-start"><span class="mediumText">Grid Width</span></div>
                                <div><input @input="debounceInput" v-model="devModeWidthValue"  type='number' style="width:75px" height="30px"><span class='smallerText'> px</span></div>
                            </div>    
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:flex-end; margin-top:15px;">
                                <div style="width:100px; display:flex; justify-content:flex-start"><span class="mediumText">Grid Height</span></div>
                                <div><input type='number' @input="debounceHeightInput" v-model="devModeHeightValue" style="width:75px" height="30px"><span class='smallerText'> px</span></div>
                            </div>   
                        </div>
                    </div>
                </div>                
                <div v-show="currentTab==='title'" style="width:75%; padding:35px; background-color:#f2ecdc; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:flex-start;">
                        <div style="display:flex; width:100%; justify-content:flex-start;">
                            <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Enable Title</span></div>
                            <div>
                                <input type="checkbox" @change="handleEnableTitle" v-model="chkEnableTitle" id="enableTitle" name="enableTitle" value="true">
                            </div>
                        </div>       
                        <div style="display:flex; width:100%; margin-top:15px; align-items:flex-end;">
                            <div style="width:150px; display:flex;justify-content:flex-start;"><span class="mediumText">Column Header</span></div>
                            <div style="width:150px; display:flex;justify-content:flex-start;"><input @input="handleTitleChange" type='text' v-model="titleText" style='width:100%'></div>
                        </div>                        
                        <div style="display:flex; width:100%; justify-content:flex-start; align-items:center; margin-top:15px;">
                            <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Title Color</span></div>
                            <div style='display:flex;  align-items:center;'>
                                <input @input="(event)=>{debounceColorChange(event,'title')}" v-model="activeColorScheme.gridTitleColor"  type='text' style="width:100px" height="30px">
                                <input type='color' @input="(event)=>{handleColorPickerChange(event,'title')}" class='colorPicker' :value='activeColorScheme.gridTitleColor'>
                            </div>
                        </div>    
                    </div>
                </div>
                <div v-show="currentTab==='header'" style="width:75%; background-color:#f2ecdc; display:flex; flex-direction:column; padding:35px; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Enable Header Row</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input type="checkbox" @change="handleEnableHeader" v-model="chkEnableHeader" id="enableHeader" name="enableHeader" value="true">                                    
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Grid Header Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ghbc')}" v-model="activeColorScheme.gridHeaderBackgroundColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ghbc')}" class='colorPicker' :value='activeColorScheme.gridHeaderBackgroundColor'>
                                </div>
                            </div>  
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Grid Header Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ghtc')}" v-model="activeColorScheme.gridHeaderTextColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ghtc')}" class='colorPicker' :value='activeColorScheme.gridHeaderTextColor'>
                                </div>

                            </div>  
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Grid Header Divider Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ghboc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.gridHeaderBorderColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ghboc')}" class='colorPicker' :value='activeColorScheme.gridHeaderBorderColor'>
                                </div>

                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Flyout Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'fbc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.flyoutBackgroundColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'fbc')}" class='colorPicker' :value='activeColorScheme.flyoutBackgroundColor'>
                                </div>

                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Flyout Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ftc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.flyoutTextColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ftc')}" class='colorPicker' :value='activeColorScheme.flyoutTextColor'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;  align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Active Indicator Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'aic')}" v-model="activeColorScheme.activeIndicatorColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'aic')}" class='colorPicker' :value='activeColorScheme.activeIndicatorColor'>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='rows'" style="width:75%; display:flex; padding:35px; background-color:#f2ecdc; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Even Row Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'grebc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.gridRowEvenBackgroundColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'grebc')}" class='colorPicker' :value='activeColorScheme.gridRowEvenBackgroundColor'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Odd Row Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'grobc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.gridRowOddBackgroundColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'grobc')}" class='colorPicker' :value='activeColorScheme.gridRowOddBackgroundColor'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Row Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'grtc')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.gridRowTextColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'grtc')}" class='colorPicker' :value='activeColorScheme.gridRowTextColor'>
                                </div>
                            </div>   
                            <br>
                            <hr style='width:100%;'>
                            <br>
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Enable Row Highlight </span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input type="checkbox" @change="handleEnaleRowHighlight" v-model="chkEnableHighlight" id="enableHeader" name="enableHeader" value="true">                                    
                                </div>
                            </div>
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Row Highlight Background</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'rhb')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.rowHighlightBackground">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'rhb')}" class='colorPicker' :value='activeColorScheme.rowHighlightBackground'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Row Highlight Active Cell</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'rhac')}" type='text' style="width:100px" height="30px" v-model="activeColorScheme.rowHighlightActiveCell">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'rhac')}" class='colorPicker' :value='activeColorScheme.rowHighlightActiveCell'>
                                </div>
                            </div>   
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='columns'" style="width:75%; padding:30px; display:flex; flex-direction:column; align-items:flex-start; background-color:#f2ecdc; justify-content:flex-start;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; flex-direction:row; align-items:center; justify-content:flex-start; align-items:center;">
                                <span style="margin-right:15px;" class="mediumText">Number Of Columns</span>
                                <input type="number" id="quantity" @change="handleColNumChange" name="quantity" v-model="numColumns" min="1" max='25' style="width:45px" height="30px">
                            </div>
                            <div style='width:100%; margin-top:15px; display:flex; flex-direction:row; align-items:center; justify-content:flex-start;'>
                                <label style="margin-right:36px;" for="columns" class="mediumText">Choose a column</label>
                                <select @change="handleColumnEdit" style="width:200px;" name="columns" id="columns">
                                    <option :value="-1">Select To Edit</option>
                                    <option v-for="(column, index) in gridSettings.columns" :key="index" :value="index">{{`header - ${column.ColumnHeader}`}}</option>
                                </select>                                
                            </div>
                            <div :style="`display:flex; flex-direction:column; width=100%; margin-top:15px; margin-bottom:10px; justify-content:center; align-items:center`">
                                    <span class="smallerText">{{`Available for customizing: ${availableForCustomizing}px`}}</span>
                            </div>
                            <div v-if="showWidthError" style='width:100%;'>
                                <span class="mediumText" style='color:red'>{{`Custom width over Max, max=${availableForCustomizing} px`}}</span>
                            </div>
                            <div v-else><br></div>
                            <hr v-show="columnSelected!==-1" style="width:100%; margin-bottom:10px; height:1px;">
                            <div v-show="columnSelected!==-1" style='width:100%; display:flex; flex-direction:column; align-items:center;'>
                                <div style="display:flex; width:100%;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span class="mediumText">Column Header</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><input @input="handleHeaderChange" type='text' v-model="activeColumnEdit.ColumnHeader" style='width:100%'></div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:15px;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span class="mediumText">Custom Width</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start; align-items:center;">
                                        <input @input="debounceHandleCustomWidth" type='number' min="0" v-model="activeColumnEdit.WidthValue" style='width:100px;'><span class='smallerText'> px</span>
                                        <span style="margin-left:10px; margin-right:10px;" class="mediumText">auto</span><input @change="handleAutoSize" v-model="activeColumnEdit.ChkAuto" style="margin:0;" type="checkbox" id="enablePresort" name="enablePresort" value="true">
                                    </div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:15px;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span class="mediumText">Data Alignment</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <select @input="handleDataAlignment" v-model="activeColumnEdit.Alignment" style="width:100px;" name="alignment" id="alignment">
                                            <option value='left'>left</option>
                                            <option value='middle'>center</option>
                                            <option value='right'>right</option>
                                        </select>                                        
                                    </div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:15px;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span class="mediumText">Data Type</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <select @input="handleDataPropertyChange" v-model="activeColumnEdit.DataType" style="width:100px;" name="dataType" id="dataType">
                                            <option value='string'>string</option>
                                            <option value='number'>number</option>
                                        </select>                                        
                                    </div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:15px;">
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><span class="mediumText">Enable Pre-sort</span></div>
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

                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Enable Paging</span></div>
                                <div>
                                    <input type="checkbox" @change="handleEnablePaging" v-model="chkEnablePaging" id="enablePaging" name="enablePaging" value="true">
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:15px; align-items:center;">
                                <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Paging Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ptc')}" v-model="activeColorScheme.pagingTextColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ptc')}" class='colorPicker' :value='activeColorScheme.pagingTextColor'>
                                </div>
                            </div>                         
                            <br>
                            <hr style="height: 1px; width: 100%;">
                            <br>
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Enable Slider</span></div>
                                <div>
                                    <input type="checkbox" @change="handleEnableSlider" v-model="chkEnableSlider" id="enableSlider" name="enableSlider" value="true">
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start;margin-top:15px; align-items:center;">
                                <div style="width:150px; display:flex; justify-content:flex-start;"><span class="mediumText">Slider Fill Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'sfc')}" v-model="activeColorScheme.sliderFillColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'sfc')}" class='colorPicker' :value='activeColorScheme.sliderFillColor'>
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
                                <div style="width:300px; display:flex; justify-content:flex-start"><span class='mediumText'>Download as .js - ready to drop in.</span></div>
                                <div><button @click="download">Download</button></div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span class='mediumText'>Download as a renamable .js.txt file</span></div>
                                <div><button @click="(event)=>{download(event,'txt')}">Download</button></div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span class='mediumText'>Download as a .zip file</span></div>
                                <div><button @click="(event)=>{download(event,'zip')}">Download</button></div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span class='mediumText'>Copy to your clipboard </span></div>
                                <div><button @click="(event)=>{download(event,'copy')}">{{copyButtonText}}</button></div>
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
import generateData from '../data/dataGenerator'

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
            workingDataSet:[],
            data:[],
            viewportHeight:0,
            totalHeight:0,
            toleranceHeight:0,
            bufferHeight:0,
            bufferedItems:0,
            itemsAbove:0,
            topPaddingHeight:0,
            bottomPaddingHeight:0,
            initialPosition:0,
            settings:{
                minIndex: 0,
                maxIndex: 0,
                startIndex: 0,
                itemHeight: 30,
                amount: 0, //number of items in the viewport
                tolerance: 2 //outlet size - rendered but not visible
            },
            initialState:{

            },
            tableTop:0,
            showWidthError:false,
            availableForCustomizing:0,
            hoverIndex:null,
            cellHoverIndex:null,
            copyButtonText:'Copy',
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
                flyoutTextColor:'',
                rowHighlightBackground:'',
                rowHighlightActiveCell:''
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
                IsUsingACustomWidth:false,
                IsPreSortEnabled:false,
                ChkAuto:true            
            },
            columnSelected:-1,
            numColumns:0,
            chkEnablePaging:true,
            chkEnableSlider:true,
            chkEnableTitle:true,
            chkEnableHeader:true,
            chkEnableHighlight:true,
            titleText:'',
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
                rows:{
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
        },
        cmpDataSet:function(){
            console.log('compDataset which one? ', this.filterStrategy.isCurrentlyFiltering, this.sortStrategy.isCurrentlySorting)
            if(this.filterStrategy.isCurrentlyFiltering||this.sortStrategy.isCurrentlySorting) return this.workingDataSet
            return this.fullDS
        }
    },
    methods: {
///////Processors////////    
        processConfig(){
            let tmp = {}
            if (Object.keys(this.gridConfig).length>0) {
                //then we have a config object to process.
                tmp = {...this.gridConfig}
            } else {
                //here b/c we have no config object so we need to load all Shift Defaults into the grid settings object.
                tmp = {...ShiftSettings}
            }
            return tmp
        },
        processData(){
            let tmp = []
            if (this.gridData.length>0) {
                //load the data from the prop
                tmp = this.gridData
            } else {
                //load some random data.
                tmp = generateData(this.gridSettings.columns.length)
            }
            return tmp
        },
///////End Processors////////    

///////Helper Functions////////
        getRowsPerPage(){
            if (this.gridSettings.pagination.Enabled) {
                if (this.weAreUsingTheSlider) {
                    return this.sliderCount //investigate this see how its used and set
                } else {
                    if((this.cmpDataSet.length>=0)&&(this.cmpDataSet.length<=100)){
                        return 100
                    } else if((this.cmpDataSet.length>100)&&(this.cmpDataSet.length<=1000)){
                        return 500
                    } else if(this.cmpDataSet.length>1000){
                        return 1000
                    }
                }                
            } 
            return this.cmpDataSet.length
        },        
        gridWillScroll(numberOfRows){
            if(this.gridSettings.developmentMode.Enabled){return} 
            let retVal = false
            let height = 0
            if(this.gridSettings.size.GridHeight){
                if(this.gridSettings.size.GridHeight.includes('p')){
                    height = this.gridSettings.size.GridHeight.split('p')[0]
                }
            }
            let tmp = 0
            if(numberOfRows){
                tmp = numberOfRows
            } else {
                tmp = this.cmpDataSet.length
            }

            if (tmp*this.settings.itemHeight>height)
            {
                retVal=true
            }
            return retVal
        
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
           widthOfGrid = this.boolGridWillScroll?(widthOfGrid*.993):widthOfGrid
           const eachColumn = Math.floor(widthOfGrid/numColumns)
            for (let i = 0; i < numCols; i++) {
                if (!custCols.includes(i)) {
                    this.gridSettings.columns[i].Width = `${eachColumn}px`
                    this.gridSettings.columns[i].WidthValue = eachColumn
                }
            }
        },
        initializePaging(numberOfRowsPerPage){
            if(this.gridSettings.pagination.Enabled===true){
                this.gridSettings.pagination = {
                Enabled:true,
                MinRecordsViewable:1,
                MaxRecordsViewable:this.cmpDataSet.length>this.gridSettings.slider.InitialValue?this.gridSettings.slider.InitialValue:this.cmpDataSet.length,
                TotalNumberOfRecords:this.cmpDataSet.length,
                PageNumberCurrentlyViewing:1,                   
                MaxPageNumberPossible:Math.ceil(this.cmpDataSet.length/this.gridSettings.slider.InitialValue),
                NumberOfApplicibleRowsPerPage:numberOfRowsPerPage,
                }
            } 
        },
        initializeSlider(numberOfRowsPerPage){
            if (this.gridSettings.slider.Enabled) {
                let minValue, maxValue, stepValue, initialValue,sliderWidth = 0
                if(numberOfRowsPerPage===100){
                    minValue=10, maxValue=100, stepValue=10, initialValue=100,sliderWidth = 300    
                } else if(numberOfRowsPerPage===500){
                    minValue=100, maxValue=1000, stepValue=100, initialValue=500,sliderWidth = 300    
                } else if(numberOfRowsPerPage===1000){
                    minValue=500, maxValue=4000, stepValue=500, initialValue=1000,sliderWidth = 300    
                }                    
                this.gridSettings.slider.MinValue = minValue;
                this.gridSettings.slider.MaxValue = maxValue;
                this.gridSettings.slider.StepValue = stepValue;
                this.gridSettings.slider.InitialValue = initialValue;
                this.gridSettings.slider.SliderWidth = sliderWidth;
            }
        },
        calculateHeightOfHeaderRow(){
            let tmp=0;
            const height = this.gridSettings.size.GridWidthValue<600?91:51; //TODO document these numbers
            tmp=this.gridSettings.header.Enabled?tmp+51:tmp+0
            tmp=this.gridSettings.pagination.Enabled?tmp+height:tmp+0
            tmp=this.gridSettings.title.Text.length>0?tmp+28:tmp+0
            return tmp
        },        
        calculateNumRows(){
            return this.boolGridWillScroll?Math.floor((this.gridSettings.size.GridHeightValue - this.headerHeight)/this.settings.itemHeight):Math.floor(this.cmpDataSet.length) 
        },
        setInitialState(minIndex, maxIndex, startIndex, itemHeight, amount, tolerance){
            // 1) height of the visible part of the viewport (px)
            this.viewportHeight = amount * itemHeight
            // 2) total height of rendered and virtualized items (px)
            this.totalHeight = (maxIndex - minIndex ) * itemHeight
            // 3) single viewport outlet height, filled with rendered but invisible rows (px)
            this.toleranceHeight = tolerance * itemHeight
            // 4) all rendered rows height, visible part + invisible outlets (px)
            this.bufferHeight = this.viewportHeight + 2 * this.toleranceHeight
            // 5) number of items to be rendered, buffered dataset length (pcs)
            this.bufferedItems =Math.floor(this.boolGridWillScroll?amount + 2 * tolerance:amount)
            // 6) how many items will be virtualized above (pcs)
            this.itemsAbove = startIndex - tolerance - minIndex
            this.topPaddingHeight = this.boolGridWillScroll?this.itemsAbove * itemHeight:0
            this.bottomPaddingHeight = this.boolGridWillScroll?this.totalHeight - this.topPaddingHeight:0
            this.initialPosition = 0
            // initial state object
            this.data = []
        },
        runScroller({target:{scrollTop}}){
            const index = Math.max(this.settings.minIndex + Math.floor((scrollTop - this.toleranceHeight) / this.settings.itemHeight),0)
            const data = this.getData(index, this.bufferedItems)
            const topPad = Math.max((index - this.settings.minIndex) * this.settings.itemHeight, 0)
            const topPaddingHeight = this.boolGridWillScroll?topPad:0
            const bottomPad = Math.max(this.totalHeight - topPaddingHeight - (data.length * this.settings.itemHeight), 0)
            this.bottomPaddingHeight= this.boolGridWillScroll?bottomPad:0
            this.topPaddingHeight = topPaddingHeight
            this.data = data
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
        getData(offset, limit){
            const data = []
            const start = offset
            const end = Math.min(offset + limit, this.settings.maxIndex)
            if (start <= end) {
                for (let i = start; i < end; i++) {
                    if (this.cmpDataSet[i]){
                        data.push({ rowIndex: i, data: this.cmpDataSet[i].data })
                    }
                }
            }
            return data
        },
        setGridState(min, max){
            this.settings.minIndex = min
            this.settings.maxIndex = max
            this.totalHeight = (this.settings.maxIndex - this.settings.minIndex ) * this.settings.itemHeight
        },
        handleNextClick(isASingleMove){
            this.pageDataForward(isASingleMove.isASinglePageMove)
            let max = 0
            const min = this.gridSettings.pagination.MinRecordsViewable
            if (isASingleMove.isASinglePageMove&&this.gridSettings.pagination.MaxPageNumberPossible!==this.gridSettings.pagination.PageNumberCurrentlyViewing) {
                max = this.gridSettings.pagination.MaxRecordsViewable
            } else {
                max = this.gridSettings.pagination.TotalNumberOfRecords  
            }
            this.setGridState(min, max)
            this.resetScroll()
            this.runScroller({target:{scrollTop:0}}) 
        },
        pageDataForward(isASinglePageMove){
            let paging = {
                Enabled:this.gridSettings.pagination.Enabled,
                TotalNumberOfRecords:this.gridSettings.pagination.TotalNumberOfRecords,
                CurrentTake:this.gridSettings.pagination.NumberOfApplicibleRowsPerPage,
                NumberOfApplicibleRowsPerPage:this.gridSettings.pagination.NumberOfApplicibleRowsPerPage,
            }
            if(isASinglePageMove){
                const tmpMinViewable = this.gridSettings.pagination.MinRecordsViewable===1?this.gridSettings.pagination.NumberOfApplicibleRowsPerPage:this.gridSettings.pagination.MinRecordsViewable+this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                paging.MinRecordsViewable=tmpMinViewable
                paging.MaxRecordsViewable=tmpMinViewable+this.gridSettings.pagination.NumberOfApplicibleRowsPerPage>this.gridSettings.pagination.TotalNumberOfRecords?this.gridSettings.pagination.TotalNumberOfRecords:tmpMinViewable+this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                paging.PageNumberCurrentlyViewing=this.gridSettings.pagination.PageNumberCurrentlyViewing+1        
                paging.MaxPageNumberPossible=this.gridSettings.pagination.MaxPageNumberPossible

            } else {
                const numberOfRowsPagingCanHandle = this.gridSettings.pagination.MaxPageNumberPossible * this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                const startValue = numberOfRowsPagingCanHandle-this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                paging.MinRecordsViewable=startValue
                paging.MaxRecordsViewable=this.gridSettings.pagination.TotalNumberOfRecords
                paging.PageNumberCurrentlyViewing=this.gridSettings.pagination.MaxPageNumberPossible        
                paging.MaxPageNumberPossible=this.gridSettings.pagination.MaxPageNumberPossible
            }
            this.gridSettings.pagination = paging
        },
        handlePreviousClick(isASingleMove){
            this.pageDataBackward(isASingleMove.isASinglePageMove)
            const min = (this.gridSettings.pagination.PageNumberCurrentlyViewing*this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)-this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
            const max = ((this.gridSettings.pagination.PageNumberCurrentlyViewing+1)*this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)-(this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)
            this.setGridState(min,max)
            this.resetScroll()
            this.runScroller({target:{scrollTop:0}})   
        },
        pageDataBackward(isASinglePageMove){
            let paging ={
                Enabled:this.gridSettings.pagination.Enabled,
                NumberOfApplicibleRowsPerPage:this.gridSettings.pagination.NumberOfApplicibleRowsPerPage,
                TotalNumberOfRecords:this.gridSettings.pagination.TotalNumberOfRecords,
            }
            if(isASinglePageMove){
                    const minRecordsMath = ((this.gridSettings.pagination.PageNumberCurrentlyViewing-1)*this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)-this.gridSettings.pagination.NumberOfApplicibleRowsPerPage<=0?1:((this.gridSettings.pagination.PageNumberCurrentlyViewing-1)*this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)-this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                    paging.MinRecordsViewable = minRecordsMath
                    paging.MaxRecordsViewable = minRecordsMath+this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                    paging.PageNumberCurrentlyViewing=this.gridSettings.pagination.PageNumberCurrentlyViewing-1        
                    paging.MaxPageNumberPossible=this.gridSettings.pagination.MaxPageNumberPossible
            } else {
                    paging.MinRecordsViewable=1
                    paging.MaxRecordsViewable=this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
                    paging.PageNumberCurrentlyViewing=1    
                    paging.MaxPageNumberPossible=Math.ceil(this.gridSettings.pagination.TotalNumberOfRecords/this.gridSettings.pagination.NumberOfApplicibleRowsPerPage)
            }
            this.gridSettings.pagination = paging
        },
        handleChangeNumberPerPage(event){
            const isTheLastPage = ()=>{
                return this.gridSettings.pagination.PageNumberCurrentlyViewing === this.gridSettings.pagination.MaxPageNumberPossible
            }

            if(this.gridSettings.developmentMode.Enabled){return} 
            this.weAreUsingTheSlider=true
            this.sliderCount = parseInt(event.target.value) //comes in from the control as a string
            this.reConfigurePagination(this.sliderCount);
            const min = this.gridSettings.pagination.MinRecordsViewable
            const max = isTheLastPage()?this.gridSettings.pagination.TotalNumberOfRecords:this.gridSettings.pagination.NumberOfApplicibleRowsPerPage
            this.setGridState(min,max)            
            this.runScroller({target:{scrollTop:0}})
            this.$refs.viewportElement.scrollTop = this.$refs.viewportElement.scrollTop-1

        },            
        reConfigurePagination(count){
            let paging = {
                Enabled:this.gridSettings.pagination.Enabled,
                MinRecordsViewable:1,
                MaxRecordsViewable:this.cmpDataSet.length<count?this.cmpDataSet.length:count,
                TotalNumberOfRecords:this.cmpDataSet.length,
                PageNumberCurrentlyViewing:1,        
                MaxPageNumberPossible:Math.ceil(this.cmpDataSet.length/count),
                NumberOfApplicibleRowsPerPage:count,
            }
            this.gridSettings.pagination = paging          
        },
        resetScroll(){
            this.$refs.viewportElement.scrollTop=0;
        },
        handleShowCancelEye(){
            this.isHovering = !this.isHovering
        },        
///////End Helper Functions////////    

///////Filter Code/////////
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
            if(this.filterStrategy.isCurrentlyFiltering){
                if(this.filterStrategy.columnsBeingFiltered.includes(col)){
                    updateFilter(col,filter)
                    this.isDoneFiltering=false
                    if(this.filterStrategy.columnsBeingFiltered.length>1){ /////////////////////todo refactor these ?
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
            this.filterStrategy = {isCurrentlyFiltering:false, filters:[], columnsBeingFiltered:[]}
        },
        handleClearFilter(columnIndex){
            if(this.gridSettings.developmentMode.Enabled||!this.filterStrategy.isCurrentlyFiltering){return} 
            const clearAFilter= (col)=>{
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
            }
            if(this.filterStrategy.columnsBeingFiltered.length===1&&this.filterStrategy.columnsBeingFiltered[0] === columnIndex.toString()){
                this.clearFilters() //will reset the filter object completely
                if (this.sortStrategy.isCurrentlySorting) {
                        const split = this.sortStrategy.strategy.split('^^')
                        this.filteredData = this.sortedData[split[0]][split[1]]
                        this.highestCountLoaded = this.getRowsPerPage();
                        this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                } else {
                        const min = this.gridSettings.pagination.MinRecordsViewable
                        const max = this.cmpDataSet.length>this.sliderCount?this.sliderCount:this.cmpDataSet.length
                        this.setGridState(min,max)
                        this.runScroller({target:{scrollTop:0}})
                        this.resetScroll();

                }
            } else {
                //then clear a filter was called on a column but other filters are applied. 
                clearAFilter(columnIndex)
                this.ww_forwardWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                this.ww_forwardWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                this.ww_reverseWorker1.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
                this.ww_reverseWorker2.postMessage({'MessageType':'applyAllFilters','Strategy':this.filterStrategy})
            }

            if(this.sortStrategy.isCurrentlySorting===true){
                this.ww_sortWorker.postMessage({'MessageType':'applySort', 'SortStrategy':this.sortStrategy.strategy})
            } 
            this.reConfigurePagination(this.sliderCount)               
        },
        handleClearAllFilters(){
            this.sortStrategy = { //todo. refactor this into a function 
                isCurrentlySorting:false,
                strategy:'',
                columnBeingSorted:''
            }
            this.clearFilters();
            this.clearAllFilters = true //TODO. follow this down and see if its needed
            const min = this.gridSettings.pagination.MinRecordsViewable
            const max = this.cmpDataSet.length>this.sliderCount?this.sliderCount:this.cmpDataSet.length
            this.reConfigurePagination(max)                    
            this.setGridState(min,max)
            this.runScroller({target:{scrollTop:0}})
            this.resetScroll();            
            
        },
///////End Filter Code/////////

///////Worker Messaging Code/////////
        handleMessage(message){
            const setMinAndScroll = (count) => {
                console.log("count received  ", count)
                this.reConfigurePagination(count)
                const min = this.gridSettings.pagination.MinRecordsViewable
                const max = this.gridSettings.pagination.MaxRecordsViewable
                this.setGridState(min,max)
                this.runScroller({target:{scrollTop:0}})
                this.resetScroll()
            }

            switch (message.data.MessageType) {
                case 'filterResults':
                case 'allFiltersApplied':   
                    if (message.data.Data.length>0) {this.tmpResults = [...this.tmpResults, ...message.data.Data]}
                    break;
                case 'filterTerminated':
                    this.numberOfTerminatedFilters = this.numberOfTerminatedFilters +1                      
                    if(this.numberOfTerminatedFilters===4)    
                    {
                        this.filterStrategy.isCurrentlyFiltering=true
                        if(this.sortStrategy.isCurrentlySorting===true){
                            this.ww_sortWorker.postMessage({'MessageType':'sortFilteredData', 'SortStrategy':this.sortStrategy.strategy, 'Data': this.tmpResults})
                            this.numberOfTerminatedFilters = 0
                            this.isDoneFiltering=true
                        } else {
                            console.log('what is the shit', this.tmpResults)
                            this.workingDataSet = this.tmpResults
                            this.numberOfTerminatedFilters = 0
                            this.tmpResults = []
                            this.isDoneFiltering=true
                            setMinAndScroll(this.cmpDataSet.length>this.sliderCount?this.sliderCount:this.cmpDataSet.length)
                            
                        }
                    }
                    break;
                case 'sortComplete':
                        this.workingDataSet = [...message.data.Data]
                        this.sortStrategy.strategy = message.data.Strategy
                        this.sortStrategy.isCurrentlySorting = true
                        this.reConfigurePagination(this.sliderCount) //I AM NOT SURE THIS SHOULD BE SLIDER COUNT?? WHY?
                        this.sortStrategy.columnBeingSorted = message.data.Column
                        this.setGridState(this.gridSettings.pagination.MinRecordsViewable,this.gridSettings.pagination.MaxRecordsViewable)
                        this.runScroller({target:{scrollTop:0}})
                        this.resetScroll()
                        this.isDoneSorting = true
                    break;
                case 'dataSorted':
                    this.tmpResultsSort= {...this.tmpResultsSort, ...message.data.Data}
                    break;
                case 'sortTerminated':
                    this.numberOfTerminatedSorts = this.numberOfTerminatedSorts +1                      
                    if(this.numberOfTerminatedSorts===2)    
                    {
                        console.log('sorting finished')
                        this.sortedData = this.tmpResultsSort
                        this.isDonePreSorting = true
                        this.ww_oddSortWorker.terminate()
                        this.ww_evenSortWorker.terminate()
                    }
                    break;
                default:
                    break;
            }
        },
///////End Worker Messaging Code/////////

///////Sorting Code/////////
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
                                console.log(this.sortedData, tmp, split)
                            this.workingDataSet = this.sortedData[tmp][split[1]]
                            const min = this.gridSettings.pagination.MinRecordsViewable;
                            const max = this.gridSettings.pagination.MaxRecordsViewable;
                            this.setGridState(min,max)
                            this.resetScroll()
                            this.runScroller({target:{scrollTop:0}})
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
                    this.highestCountLoaded = this.getRowsPerPage();
                    this.filteredData = []
                    this.filteredData = this.fullDS 
                    this.dataSlice = this.filteredData.slice(0,this.highestCountLoaded)
                }
            }

        },
///////End Sorting Code/////////




















































































































        






















































        
        
        
        
        
        
        
        
        
        
        
        
        
        
        handleAutoSize(){
            this.activeColumnEdit.IsUsingACustomWidth=false;
            this.activeColumnEdit.Width=null
            this.activeColumnEdit.WidthValue=null
            this.activeColumnEdit.ChkAuto = true;
            this.gridSettings.columns[this.activeColumnEdit.Index].IsUsingACustomWidth = false
            this.gridSettings.columns[this.activeColumnEdit.Index].Width = null
            this.gridSettings.columns[this.activeColumnEdit.Index].WidthValue = null
            this.calculateColumnWidths()
            this.availableForCustomizing = this.calculateAvailableSpace()
        },
        handleEnaleRowHighlight(){
            this.gridSettings.rows.HighlightRowEnabled = this.chkEnableHighlight
        },
        handleTitleChange(event){
            this.gridSettings.title.Text = event.target.value
        },
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
                case 'rhb':
                    this.activeColorScheme.rowHighlightBackground = event.target.value
                    this.gridSettings.colorScheme.RowHighlightBackground = event.target.value
                    break;
                case 'rhac':
                    this.activeColorScheme.rowHighlightActiveCell = event.target.value
                    this.gridSettings.colorScheme.RowHighlightActiveCell = event.target.value
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
        Height:'${this.gridSettings.rows.HeightValue}px', //Change at own risk
        HeightValue:${this.gridSettings.rows.HeightValue}, //Change at own risk
        HighlightRowEnabled:'${this.gridSettings.rows.HighlightRowEnabled}',
    },
    slider:{ //Change at own risk
        Enabled:${this.gridSettings.slider.Enabled},
        SliderWidth:${this.gridSettings.slider.SliderWidth},
        MinValue:${this.gridSettings.slider.MinValue},
        MaxValue:${this.gridSettings.slider.MaxValue},
        StepValue:${this.gridSettings.slider.StepValue},
        InitialValue:${this.gridSettings.slider.InitialValue}
    },
    pagination:{ //Change at own risk
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
        Enabled:'${this.gridSettings.title.Enabled}',
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
        FlyoutTextColor:'${this.gridSettings.colorScheme.FlyoutTextColor}',
        RowHighlightBackground:'${this.gridSettings.colorScheme.RowHighlightBackground}',
        RowHighlightActiveCell:'${this.gridSettings.colorScheme.RowHighlightActiveCell}',

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
        
        async download(event,downloadAs) {
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
                case 'copy':
                        try {
                            await navigator.clipboard.writeText(this.generateConfig())
                            this.copyButtonText = 'Copied!'
                            setTimeout(() => {
                                this.copyButtonText = 'Copy'
                            }, 3000);
                        } catch (error) {
                            console.log('failed to copy')
                        }

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



        debounceHandleCustomWidth: debounce(function (event){
            if(event.target.value > this.availableForCustomizing){
                this.activeColumnEdit.Width=null;
                this.activeColumnEdit.WidthValue=null;
                this.activeColumnEdit.ChkAuto=true
                this.gridSettings.columns[this.activeColumnEdit.Index].IsUsingACustomWidth=false
                this.showWidthError = true;
                setTimeout(() => {
                    this.showWidthError = false;
                }, 3000);
            } else {
                this.gridSettings.columns[this.activeColumnEdit.Index].Width=event.target.value+'px';
                this.gridSettings.columns[this.activeColumnEdit.Index].WidthValue=parseInt(event.target.value);
                this.gridSettings.columns[this.activeColumnEdit.Index].IsUsingACustomWidth=event.target.value>0
                this.activeColumnEdit.ChkAuto=!event.target.value>0
            }
            this.calculateColumnWidths()            
            this.availableForCustomizing=this.calculateAvailableSpace()            
        },750), 
        handleDataAlignment(event){
            this.gridSettings.columns[this.activeColumnEdit.Index].Alignment = event.target.value
        },
        handleDataPropertyChange(){
            this.gridSettings.columns[this.activeColumnEdit.Index].DataType = event.target.value //todo refactor these so its one function accepting the property to.. 
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
                    Width: this.gridSettings.columns[event.target.value].IsUsingACustomWidth?this.gridSettings.columns[event.target.value].Width:'',
                    WidthValue: this.gridSettings.columns[event.target.value].IsUsingACustomWidth?this.gridSettings.columns[event.target.value].WidthValue:null,
                    Alignment:this.gridSettings.columns[event.target.value].Alignment,
                    DataType:this.gridSettings.columns[event.target.value].DataType,
                    IsUsingACustomWidth:this.gridSettings.columns[event.target.value].IsUsingACustomWidth,
                    IsPreSortEnabled:this.gridSettings.columns[event.target.value].IsPreSortEnabled,
                    ChkAuto:this.gridSettings.columns[event.target.value].IsUsingACustomWidth?false:true
                }            
                
            } else {
                this.activeColumnEdit={
                    ColumnHeader:'',
                    Index:0,
                    Width:'',
                    WidthValue:0,
                    Alignment:'',
                    DataType:'',
                    IsUsingACustomWidth:false,
                    IsPreSortEnabled:false,
                    ChkAuto:true
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
                            Alignment:'center',
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
                let newDataArray = []
                for (let i = 0; i < this.data.length; i++) {
                    
                    newDataArray.push(
                        {
                            rowIndex:this.data[i].rowIndex,
                            data:this.data[i].data.splice(0,currentCount-numToPop)    
                        }
                    )
                }
                //this.data = newDataArray
                
                console.log("after", this.data)
            }
            this.calculateColumnWidths() 
            this.availableForCustomizing= this.calculateAvailableSpace()           
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

        debounceInput: debounce(function (event){
            this.gridSettings.size.GridWidth = `${event.target.value}px`
            this.gridSettings.size.GridWidthValue = parseInt(event.target.value)
            this.calculateColumnWidths()
            this.availableForCustomizing = this.calculateAvailableSpace()
        },750),     
        debounceHeightInput: debounce(function (event){
            this.gridSettings.size.GridHeight = `${event.target.value}px`
            this.gridSettings.size.GridHeightValue = parseInt(event.target.value)
            this.viewportHeight = this.gridSettings.size.GridHeightValue - this.headerHeight
            this.settings.amount = Math.floor(this.viewportHeight/30) 
            this.bufferedItems = this.settings.amount + 2 * this.settings.tolerance
            this.runScroller({target:{scrollTop:0}})
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
                case 'rhb':
                    tmpField = 'RowHighlightBackground'
                    break;
                case 'rhac':
                    tmpField = 'RowHighlightActiveCell'
                    break;                    
                default:
                    break;
            }
            this.gridSettings.colorScheme[tmpField] = event.target.value
        },750),      


        handleFilterClosed(){
            if(this.gridSettings.developmentMode.Enabled){return} 
            this.filterCount = 0
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
      



















       

        
        getCustomWidths(){
            let widthData = {}
            let custom = 0
            let rest = 0
            let custCount = 0
            for (let i = 0; i < this.gridSettings.columns.length; i++) {
                if(this.gridSettings.columns[i].IsUsingACustomWidth){
                    custom = custom + this.gridSettings.columns[i].WidthValue
                    custCount++
                } else {
                    rest += this.gridSettings.columns[i].WidthValue
                }
            }
            widthData.custom = custom
            widthData.rest = rest
            widthData.custCount = custCount
            return widthData 
        },
        calculateAvailableSpace(){
            const widthData = this.getCustomWidths()
            return(widthData.rest)
        },
        initializeDevMode(){
            this.devModeWidthValue = this.gridSettings.size.GridWidthValue
            this.devModeHeightValue = this.gridSettings.size.GridHeightValue
            this.activeColorScheme.sliderFillColor = this.gridSettings.colorScheme.SliderFillColor
            this.activeColorScheme.pagingTextColor = this.gridSettings.colorScheme.PagingTextColor
            this.activeColorScheme.gridTitleColor = this.gridSettings.colorScheme.GridTitleColor
            this.activeColorScheme.gridHeaderTextColor = this.gridSettings.colorScheme.GridHeaderTextColor
            this.activeColorScheme.gridRowTextColor = this.gridSettings.colorScheme.GridRowTextColor
            this.activeColorScheme.gridHeaderBackgroundColor = this.gridSettings.colorScheme.GridHeaderBackgroundColor
            this.activeColorScheme.gridRowOddBackgroundColor = this.gridSettings.colorScheme.GridRowOddBackgroundColor
            this.activeColorScheme.gridRowEvenBackgroundColor = this.gridSettings.colorScheme.GridRowEvenBackgroundColor
            this.activeColorScheme.activeIndicatorColor = this.gridSettings.colorScheme.ActiveIndicatorColor
            this.activeColorScheme.gridHeaderBorderColor = this.gridSettings.colorScheme.GridHeaderBorderColor
            this.activeColorScheme.flyoutBackgroundColor = this.gridSettings.colorScheme.FlyoutBackgroundColor
            this.activeColorScheme.flyoutTextColor = this.gridSettings.colorScheme.FlyoutTextColor
            this.activeColorScheme.rowHighlightBackground = this.gridSettings.colorScheme.RowHighlightBackground
            this.activeColorScheme.rowHighlightActiveCell = this.gridSettings.colorScheme.RowHighlightActiveCell
            this.chkEnablePaging = this.gridSettings.pagination.Enabled
            this.chkEnableSlider = this.gridSettings.slider.Enabled
            this.chkEnableTitle = this.gridSettings.title.Enabled 
            this.chkEnableHeader = this.gridSettings.header.Enabled
            this.chkEnableHighlight = this.gridSettings.rows.HighlightRowEnabled
            this.titleText = this.gridSettings.title.Text
            this.availableForCustomizing = this.calculateAvailableSpace()
            this.numColumns = this.gridSettings.columns.length
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
        this.gridSettings = this.processConfig()
        this.fullDS = this.processData()
        this.boolGridWillScroll = this.gridWillScroll()
        this.calculateColumnWidths()
        const rows = this.getRowsPerPage()
        this.initializePaging(rows)
        this.initializeSlider(rows)
        this.settings.maxIndex = this.gridSettings.pagination.Enabled?rows:this.cmpDataSet.length
        this.headerHeight = this.calculateHeightOfHeaderRow()
        this.settings.amount = this.calculateNumRows()
        this.setInitialState(this.settings.minIndex,this.settings.maxIndex,this.settings.startIndex,this.settings.itemHeight,this.settings.amount,this.settings.tolerance)
        this.runScroller({target:{scrollTop:0}})   
        
        
        if(this.gridSettings.developmentMode.Enabled){
            this.initializeDevMode()
            setTimeout(async() => {
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
            }, 250);
        }
    }
};
</script>
<style >
        td {
            vertical-align: middle;
        }
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
        .highlightRow{
            background-color: tomato !important;
        }
        .dataRow{
            width:100%; 
            display:flex; 
            flex-direction:row;
            scroll-behavior: smooth;
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
        .smallerText{
            font-size: 12px;
        }
        .mediumText{
            font-size:14px
        }
        .item{
            
        }

</style>
