function createPreviewNavigation({routeForView,routeFromHash,hashForRoute,captureVisit,applyRoute,hasUnsavedChanges,confirmLeave}) {
  const visits=new Map();
  let current={detailPreview:true,index:0,route:routeFromHash(location.hash)};
  let afterRestore=null;
  history.scrollRestoration='manual';
  const url=route=>location.pathname+location.search+hashForRoute(route);
  history.replaceState(current,'',url(current.route));
  function remember(){visits.set(current.index,captureVisit());}
  function push(view){
    const route=routeForView(view);
    if(JSON.stringify(route)===JSON.stringify(current.route))return;
    remember();current={detailPreview:true,index:current.index+1,route};
    history.pushState(current,'',url(route));
  }
  function restore(entry){current=entry;applyRoute(entry.route,visits.get(entry.index));}
  window.addEventListener('popstate',event=>{
    if(afterRestore){const next=afterRestore;afterRestore=null;next();return;}
    const target=event.state?.detailPreview?event.state:{detailPreview:true,index:current.index+1,route:routeFromHash(location.hash)};
    remember();
    if(!hasUnsavedChanges()){
      if(!event.state?.detailPreview)history.replaceState(target,'',url(target.route));
      restore(target);return;
    }
    const distance=current.index-target.index;
    if(!distance){
      history.replaceState(current,'',url(current.route));
      confirmLeave(()=>{current=target;history.replaceState(target,'',url(target.route));applyRoute(target.route,visits.get(target.index));});
      return;
    }
    // Keep editing must also keep the current URL and browser-history position.
    afterRestore=()=>confirmLeave(()=>history.go(-distance));
    history.go(distance);
  });
  return {initial:current.route,push};
}
